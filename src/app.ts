import express, { Request, Response } from 'express';
import { port } from './config';
import logger from './core/logger';
import cors from 'cors';
import bodyparser from 'body-parser';

process.on('uncaughtException', (e) => {
  logger.error(e);
});

const app = express();

app.use(bodyparser);
app.use(cors());
// API Endpoints
app.get('/', (req: Request, res: Response) => {
  res.send('Hi');
});

export default app;
