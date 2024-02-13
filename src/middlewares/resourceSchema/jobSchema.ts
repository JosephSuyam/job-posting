import { TypeOf, z } from 'zod'
import { DepartmentList, EmploymentType, JobStatus } from '../../models/enums/jobs.enum';
import { getValues } from '../../helpers/zod.helper';
import { DataSource } from '../../helpers/types/common.types';

export const jobSchema = {
  getJobsSchema: z.object({
    query: z.object({
      limit: z.number(),
      page: z.number(),
      search: z.string(),
      source: z.enum(getValues(DataSource)),
    }).optional(),
  }),
  addJobSchema: z.object({
    body: z.object({
      title: z.string(),
      company: z.string(),
      department: z.enum(getValues(DepartmentList)),
      employment_type: z.enum(getValues(EmploymentType)),
      location: z.string(),
      description: z.string(),
    }),
  }).required(),
  updateJobStatusSchema: z.object({
    params: z.object({
      id: z.string(),
      status: z.union([
        z.literal(JobStatus.APPROVED),
        z.literal(JobStatus.SPAM),
      ]),
    }),
  }).required(),
}

export type GetJobSchema = TypeOf<typeof jobSchema.getJobsSchema>['query'];
export type AddJobSchema = TypeOf<typeof jobSchema.addJobSchema>['body'];
export type UpdateJobStatusSchema = TypeOf<typeof jobSchema.updateJobStatusSchema>['params'];
