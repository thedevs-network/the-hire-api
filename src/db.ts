import * as Datastore from "nedb-promise";

const job = new Datastore({
  autoload: true,
  filename: "data/Job.db",
});

export interface IJob {
  company: string;
  country: string;
  createdAt: string;
  description: string;
  email?: string;
  applyLink?: string;
  experience: "Junior" | "Mid-Level" | "Senior";
  id: string;
  isRemote: boolean;
  role: string;
  tags: string[];
  technologies: string[];
  telegramUsername?: string;
  type: string;
  website?: string;
}

export const addJob = (data: IJob) => job.insert(data);

export const updateJob = (data: IJob) => job.update({ _id: data.id }, data);

export const getJobsCount = (params: Partial<IJob> = {}) => job.count(params);

export const getJobs = ({
  limit,
  skip,
  ...params
}: Partial<IJob> & { limit: number; skip: number }) =>
  job
    .cfind(params || {}, {
      company: 0,
      description: 0,
      email: 0,
      telegramUsername: 0,
      website: 0,
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();

export const getSingleJob = (id: string) => job.findOne({ _id: id });

export const deleteJob = (id: number) => job.remove({ _id: id });

export default job;
