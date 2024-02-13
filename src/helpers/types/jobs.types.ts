import { JobAttributes } from '../../models/jobs.model';

export type JobList = {
  rows: JobAttributes[];
  count: number
}

export type JobData = {
  message: string;
  data: JobAttributes;
}
