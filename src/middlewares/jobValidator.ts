import { z } from 'zod'
import { Request, Response, NextFunction } from 'express';
import { jobSchema } from './resourceSchema/jobSchema';

const { addJobSchema, updateJobStatusSchema } = jobSchema;

export const addJobValidator = () => (req: Request, res: Response, next: NextFunction) => {
  try {
    addJobSchema.parse(req);
    next();
  } catch(e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ message: e.issues })
    }
  }
};

export const updateJobStatusValidator = () => (req: Request, res: Response, next: NextFunction) => {
  try {
    updateJobStatusSchema.parse(req);
    next();
  } catch(e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ message: e.issues })
    }
  }
};
