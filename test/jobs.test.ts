import request from 'supertest';
import app from '../app';
import dotenv from 'dotenv';
import sequelizeConnection from '../src/models';
import Jobs from '../src/models/jobs.model';
import { job_list } from './job.fixtures';
import { JobStatus } from '../src/models/enums/jobs.enum';

dotenv.config();

let id: string;
const job_posting = {
  title: 'Senior Accountant',
  company: 'Nickelbase',
  location: 'BGC, Philippines',
  department: 'Accountancy',
  employment_type: 'Full Time',
  description: 'Should be saved to db.',
};

describe('Jobs CRUD Endpoints', () => {
  beforeAll(async () => {
    await sequelizeConnection.sync({ force: true });
    await Jobs.bulkCreate(job_list);
  });

  describe('POST -- /api/jobs', () => {
    it('should add new note', async () => {
      return request(app)
        .post('/api/jobs')
        .send(job_posting)
        .expect(201)
        .then((res) => {
          expect(res.statusCode).toBe(201);
          const { data } = res.body;
          expect(data.title).toBe(job_posting.title);
          expect(data.description).toBe(job_posting.description);
          id = data.id;
        })
    });

    it('should validate empty request', async () => {
      return request(app)
        .post('/api/jobs')
        .send()
        .expect(400)
        .then((res) => {
          expect(res.statusCode).toBe(400);
        })
    });
  });

  describe('GET -- /api/jobs/:status/:id', () => {
    it('should update job status', async () => {
      return request(app)
        .get(`/api/jobs/${JobStatus.APPROVED}/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.data.length).not.toBe(0);
        })
    });
  });

  describe('GET -- /api/jobs', () => {
    it('should return all jobs', async () => {
      return request(app)
        .get('/api/jobs')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.data.length).not.toBe(0);
        })
    });
  });

  describe('GET -- /api/jobs/:id', () => {
    it('should return specific note', async () => {
      return request(app)
        .get(`/api/jobs/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          const { data } = res.body;
          expect(data.title).toBe(job_posting.title);
          expect(data.description).toBe(job_posting.description);
        })
    });
  });
});
