export const DataSource = {
  INTERNAL: 'internal',
  MRGE: 'mrge',
}

export type ErrorResponse = {
  message: any;
}

export type Pagination = {
  total_count: number;
  total_pages: number;
  current_page: number;
}

export type PaginatedDataResponse<D> = {
  message: string;
  pagination: Pagination;
  data: D[];
}
