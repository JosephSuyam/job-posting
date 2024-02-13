import { GetJobsSchema } from "../middlewares/resourceSchema/jobSchema";
import { JobAttributes } from "../models/jobs.model";
import { Pagination } from "./types/common.types";
import { MrgeJobPosting } from "../client/mrge";

type PagingData = {
  limit: number;
  offset: number;
  page: number;
}

export const getPaging = (paging: Partial<GetJobsSchema>): PagingData => {
  const limit = paging?.limit ? paging?.limit : 10;
  const offset = paging?.page ? (paging?.page - 1) * limit : 0;

  return { limit, offset, page: paging?.page || 1 };
};

export const pagination = (count: number, paging: PagingData): Pagination => {
  const current_page = paging.page ? Number(paging.page) : 1;
  const total_pages = Math.ceil(count / paging.limit);

  return { total_count: count, total_pages, current_page };
}

export const paginate = (
  data: (JobAttributes | MrgeJobPosting)[] | MrgeJobPosting[],
  page: number,
  limit: number,
): (JobAttributes | MrgeJobPosting)[] => (
  data.slice((page - 1) * limit, page * limit)
);

export const validateUUID = (uuid: string) => {
  const pattern = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return uuid.match(pattern);
};
