import axios, { AxiosResponse } from 'axios';
import { transform } from 'camaro';

const client = axios.create({
  baseURL: process.env.MRGE_JOB_LIST_URL,
  headers: {
    'Accept': 'application/xml',
  },
});

type JobDescription = {
  name: string;
  description: string;
}

type JobDescriptionTemplate = [
  string, JobDescription
]

export type MrgeJobPosting = {
  id: string;
  title: string;
  company: string;
  location: string;
  department: string;
  job_type: string;
  employment_type: string;
  description: JobDescription[];
  recruiting_category: string;
  seniority: string;
  years_of_experience: string;
  created_at: string;
};

type MrgeJobPostingTemplate = [
  string,
  {
    id: string;
    title: string;
    company: string;
    location: string;
    department: string;
    job_type: string;
    employment_type: string;
    description: JobDescriptionTemplate;
    recruiting_category: string;
    seniority: string;
    years_of_experience: string;
    created_at: string;
  }
]

export const fetchMrgeData = async (): Promise<MrgeJobPosting[]> => {
  try {
    const { data }: AxiosResponse = await client.get(`/`);

    const template: MrgeJobPostingTemplate = [
      'workzag-jobs/position', {
        id: 'id',
        title: 'name',
        company: 'subcompany',
        department: 'department',
        location: 'office',
        job_type: 'employmentType',
        employment_type: 'schedule',
        description: [ 'jobDescriptions/jobDescription', {
          name: 'title-case(name)',
          description: 'value',
        }],
        recruiting_category: 'recruitingCategory',
        seniority: 'seniority',
        years_of_experience: 'yearsOfExperience',
        created_at: 'createdAt',
      }
    ];

    return await transform(data, template);
  } catch(err: any) {
    console.log('fetchMrge error: ', err);
    return err;
  }  
};