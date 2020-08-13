/* eslint-disable import/newline-after-import */
import app from './app';
import logger from './core/logger';
import { port, environment } from './config';

const server = app.listen(port, () => {
  logger.info(
    `App is running on http://localhost:${port} in ${environment} mode`,
  );
});

export default server;
