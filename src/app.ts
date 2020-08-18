import express, { Request, Response } from 'express';
import logger from './core/logger';
import cors from 'cors';
import './database';
import bodyparser from 'body-parser';
import routesV1 from './routes/v1/index';

process.on('uncaughtException', (e) => {
  console.log(e);
  logger.error(e);
});

const app = express();

app.use(bodyparser.json());
app.use(cors());
// API Endpoints
app.use('/v1', routesV1);
app.get('/', (req: Request, res: Response) => {
  res.send('Hi');
});

export default app;
