import { Router } from 'express';
import { addJobValidator, fetchJobsValidator, getJobsValidator, updateJobStatusValidator } from '../middlewares/jobValidator';
import { getJobs, fetchJob, addJob, updateJobStatus } from '../controllers/jobs';

const jobsRouter = Router();

jobsRouter.get('/', getJobsValidator(), getJobs);
jobsRouter.get('/:id', fetchJobsValidator(), fetchJob);
jobsRouter.get('/:status/:id', updateJobStatusValidator(), updateJobStatus);
jobsRouter.post('/', addJobValidator(), addJob);

export default jobsRouter;
