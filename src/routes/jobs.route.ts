import { Router } from 'express';
import { addJobValidator, updateJobStatusValidator } from '../middlewares/jobValidator';
import { getJobs, addJob, updateJobStatus } from '../controllers/jobs';

const jobsRouter = Router();

jobsRouter.get('/', getJobs);
jobsRouter.get('/:status/:id', updateJobStatusValidator(), updateJobStatus);
jobsRouter.get('/:id', getJobs);
jobsRouter.post('/', addJobValidator(), addJob);
jobsRouter.put('/:id', addJobValidator(), addJob);

export default jobsRouter;
