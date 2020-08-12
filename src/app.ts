/* eslint-disable babel/object-curly-spacing */
import express, { Request, Response } from 'express';

import { port } from './config';

// Our Express APP config
const app = express();
app.set('port', port || 3000);

// API Endpoints
app.get('/', (req: Request, res: Response) => {
  res.send('Hi');
});

// export our app
export default app;
