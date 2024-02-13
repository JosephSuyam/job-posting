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
        // ...paging,
        where: where_statement,
      }),
      fetchMrgeData(),
    ]);
    const message = SUCCESS_MESSAGES.RETRIEVE_JOB_LIST;

    if (req.query?.source === DataSource.MRGE) {
      return res.status(200).json({
        message,
        pagination: pagination(externalJobPostings.length, paging),
        data: paginate(externalJobPostings, paging.page, paging.limit),
      });
    } else if (req.query?.source === DataSource.INTERNAL) {
      return res.status(200).json({
        message,
        pagination: pagination(jobs.count, paging),
        data: jobs.rows,
      });
    }
    const job_list = [ ...jobs.rows, ...externalJobPostings ];

    return res.status(200).json({
      message,
      pagination: pagination(jobs.count + externalJobPostings.length, paging),
      data: paginate(job_list, paging.page, paging.limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
}

export const fetchJob = async (
  req: Request<FetchJobSchema>,
  res: Response<JobData<JobAttributes | null | MrgeJobPosting> | ErrorResponse>
) => {
  try {
    if (validateUUID(req.params.id)) {
      const job = await Jobs.findOne({ where: { id: req.params.id, status: JobStatus.APPROVED } });

      return res.status(200).json({
        message: SUCCESS_MESSAGES.RETRIEVE_JOB_Data,
        data: job,
      });
    } else {
      const externalJobPostings = await fetchMrgeData();
      const job = externalJobPostings.find((data) => data.id === req.params.id);

      return res.status(200).json({
        message: SUCCESS_MESSAGES.RETRIEVE_JOB_Data,
        data: job,
      });
    }
    // let data: JobAttributes | MrgeJobPosting | undefined;
    // const [jobs, externalJobPostings]: [JobAttributes | null, MrgeJobPosting[]] = await Promise.all([
    //   Jobs.findOne({ where: { id: req.params.id, status: JobStatus.APPROVED } }),
    //   fetchMrgeData(),
    // ]);

    // data = !jobs ? externalJobPostings.find((data) => data.id === req.params.id) : jobs;

    // return res.status(200).json({
    //   message: SUCCESS_MESSAGES.RETRIEVE_JOB_Data,
    //   data: data,
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
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

    return res.status(201).json({ message: SUCCESS_MESSAGES.CREATE_JOB_SUCCESS, data: job });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error });
  }
}

export const updateJobStatus = async (
  req: Request<UpdateJobStatusSchema>,
  res: Response<JobData<JobAttributes> | ErrorResponse>
) => {
  try {
    const { id, status } = req.params;
    const job = await Jobs.findOne({ where: { id, status: JobStatus.PENDING } });

    if (!job) return res.status(409).json({ message: ERROR_MESSAGES.UPDATE_JOB_ERROR });
    else {
      job.status = status;
      await job.save();
    }

    return res.status(201).json({ message: SUCCESS_MESSAGES.UPDATE_JOB_SUCCESS, data: job });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error });
  }
}
