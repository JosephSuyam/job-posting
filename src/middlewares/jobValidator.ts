import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { jobSchema } from './resourceSchema/jobSchema';
import { formatZodError } from '../helpers/zod.helper';

const {
  getJobsSchema,
  fetchJobSchema,
  addJobSchema,
  updateJobStatusSchema,
} = jobSchema;

export const getJobsValidator = () => (req: Request, res: Response, next: NextFunction) => {
  try {
    getJobsSchema.parse(req);
    next();
  } catch(e: any) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: formatZodError(e) })
  }
};

export const fetchJobsValidator = () => (req: Request, res: Response, next: NextFunction) => {
  try {
    fetchJobSchema.parse(req);
    next();
  } catch(e: any) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: formatZodError(e) })
  }
};

export const addJobValidator = () => (req: Request, res: Response, next: NextFunction) => {
  try {
    addJobSchema.parse(req);
    next();
  } catch(e: any) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: formatZodError(e) })
  }
};

export const updateJobStatusValidator = () => (req: Request, res: Response, next: NextFunction) => {
  try {
    updateJobStatusSchema.parse(req);
    next();
  } catch(e: any) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: formatZodError(e) })
  }
};
