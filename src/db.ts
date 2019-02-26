import * as Datastore from 'nedb-promise';

const job = new Datastore({
  autoload: true,
  filename: 'data/Job.db',
});

job.ensureIndex({
  fieldName: 'id',
  unique: true,
});

export interface IJob {
  company: string;
  country: string;
  createdAt: string;
  description: string;
  email?: string;
  experience: 'Junior' | 'Mid-Level' | 'Senior';
  id: string;
  isRemote: boolean;
  role: string;
  tags: string[];
  technologies: string[];
  telegramUsername?: string;
  type: string;
  website?: string;
}

export const addJob = (data: IJob) =>
  job.insert({ id: data.id }, data, { upsert: true });

export const updateJob = (data: IJob) =>
  job.update({ id: data.id }, data);

export const getJobsCount = (params: Partial<IJob> = {}) => job.count(params);

export const getJobs = ({
  limit,
  skip,
  ...params
}: Partial<IJob> & { limit: number; skip: number }) =>
  job
    .find(params || {}, {
      company: 0,
      description: 0,
      email: 0,
      telegramUsername: 0,
      website: 0,
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

export const getSingleJob = (id: string) => job.findOne({ id });

export const deleteJob = (id: number) => job.remove({ id });

export default job;
