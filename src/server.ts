import { config as dotenv } from 'dotenv';
dotenv();

import * as express from 'express';
import { addJob, getJobs, getJobsCount, getSingleJob, updateJob } from './db';
import { sendJob } from './bot';

const app = express();

const SECRET = process.env.SECRET;

app.use(express.json());

const auth = (req, res, next) => {
  if (req.body.secret !== SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
};

app.post('/api/jobs', auth, async (req, res) => {
  try {
    const { secret, ...data } = req.body;
    const job = {
      ...data,
      createdAt: new Date().toJSON(),
    };
    await addJob(job);
    await sendJob(job);
  } catch (error) {
    return res.status(401).json({ message: "Couldn't create the job." });
  }
  return res.status(201).json({ message: 'Job has been created and sent.' });
});

app.put('/api/jobs', auth, async (req, res) => {
  try {
    const { secret, ...data } = req.body;
    await updateJob(data);
  } catch (error) {
    return res.status(401).json({ message: "Couldn't create the job." });
  }
  return res.status(201).json({ message: 'Job has been created and sent.' });
});

app.get('/api/jobs', async (req, res) => {
  const { limit = 5, skip = 0, ...params } = req.query;
  const [total, jobs] = await Promise.all([
    getJobsCount(params),
    getJobs({ limit, skip, ...params }),
  ]);
  return res.json({ limit, skip, total, data: jobs });
});

app.get('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  const job = await getSingleJob(id);
  if (!job) return res.status(400).json({ message: 'Job does not exist.' });
  return res.json(job);
});

app.listen(process.env.PORT || 3000);
