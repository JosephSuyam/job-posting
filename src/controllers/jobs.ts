import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Jobs, { JobAttributes } from '../models/jobs.model';
import { JobStatus } from '../models/enums/jobs.enum';
import { sendJobRequestEmail } from '../helpers/nodemailer.helper';
import { getPaging, paginate, pagination, validateUUID } from '../helpers/common.helper';
import {
  GetJobsSchema,
  FetchJobSchema,
  AddJobSchema,
  UpdateJobStatusSchema,
} from '../middlewares/resourceSchema/jobSchema';
import { JobData, JobList } from '../helpers/types/jobs.types';
import { DataSource, ErrorResponse, PaginatedDataResponse } from '../helpers/types/common.types';
import { MrgeJobPosting, fetchMrgeData } from '../client/mrge';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../helpers/common/response';
import httpStatus from 'http-status';

export const getJobs = async (
  req: Request<{}, {}, {}, GetJobsSchema>,
  res: Response<PaginatedDataResponse<JobAttributes | MrgeJobPosting> | ErrorResponse>
) => {
  try {
    const paging = getPaging(req.query);
    let where_statement: any = { status: JobStatus.APPROVED };

    if(req.query?.search)
      where_statement.title = { [Op.like]: `%${req.query.search}%` };

    const [jobs, externalJobPostings]: [JobList, MrgeJobPosting[]] = await Promise.all([
      Jobs.findAndCountAll({
        where: where_statement,
        // ...paging,
      }),
      fetchMrgeData(),
    ]);
    const message = SUCCESS_MESSAGES.RETRIEVE_JOB_LIST;

    if (req.query?.source === DataSource.MRGE) {
      return res.status(httpStatus.OK).json({
        message,
        pagination: pagination(externalJobPostings.length, paging),
        data: paginate(externalJobPostings, paging.page, paging.limit),
      });
    } else if (req.query?.source === DataSource.INTERNAL) {
      return res.status(httpStatus.OK).json({
        message,
        pagination: pagination(jobs.count, paging),
        data: jobs.rows,
      });
    }
    const job_list = [ ...jobs.rows, ...externalJobPostings ];

    return res.status(httpStatus.OK).json({
      message,
      pagination: pagination(jobs.count + externalJobPostings.length, paging),
      data: paginate(job_list, paging.page, paging.limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
  }
}

export const fetchJob = async (
  req: Request<FetchJobSchema>,
  res: Response<JobData<JobAttributes | null | MrgeJobPosting> | ErrorResponse>
) => {
  try {
    if (validateUUID(req.params.id)) {
      const job = await Jobs.findOne({ where: { id: req.params.id, status: JobStatus.APPROVED } });

      return res.status(httpStatus.OK).json({
        message: SUCCESS_MESSAGES.RETRIEVE_JOB_Data,
        data: job,
      });
    } else {
      const externalJobPostings = await fetchMrgeData();
      const job = externalJobPostings.find((data) => data.id === req.params.id);

      return res.status(httpStatus.OK).json({
        message: SUCCESS_MESSAGES.RETRIEVE_JOB_Data,
        data: job,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
  }
}

export const addJob = async (
  req: Request<{}, {}, AddJobSchema>,
  res: Response<JobData<JobAttributes> | ErrorResponse>
) => {
  try {
    const job = await Jobs.create(req.body);

    await sendJobRequestEmail({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      employment_type: job.employment_type,
    });

    return res.status(httpStatus.CREATED).json({
      message: SUCCESS_MESSAGES.CREATE_JOB_SUCCESS, data: job
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
  }
}

export const updateJobStatus = async (
  req: Request<UpdateJobStatusSchema>,
  res: Response<JobData<JobAttributes> | ErrorResponse>
) => {
  try {
    const { id, status } = req.params;
    const job = await Jobs.findOne({ where: { id, status: JobStatus.PENDING } });

    if (!job) return res.status(httpStatus.CONFLICT).json({
      message: ERROR_MESSAGES.UPDATE_JOB_ERROR
    });
    else {
      job.status = status;
      await job.save();
    }

    return res.status(httpStatus.OK).json({
      message: SUCCESS_MESSAGES.UPDATE_JOB_SUCCESS, data: job
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
  }
}
