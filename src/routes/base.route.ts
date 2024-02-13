import { Router } from 'express';
import jobsRouter from './jobs.route';

const baseRouter = Router();

baseRouter.use('/jobs', jobsRouter);

export default baseRouter;