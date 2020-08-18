import mongoose from 'mongoose';
import { DBURI } from '../config';
import logger from '../core/logger';

const opts = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(DBURI!, opts)
  .then(() => logger.info('mongoDb connected'))
  .catch((err) => {
    logger.error(err);
  });

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('App terminated, mongodbd terminated!');
    process.exit(0);
  });
});
