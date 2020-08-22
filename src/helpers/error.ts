import { NextFunction, Request, Response } from 'express';
import HttpException from '../core/response';

export default (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
): Response => {
  return response.send({
    error,
  });
};
// export default (

// ) => {
//   const status = error.status || 500;
//   const message = error.message || 'Something went wrong';
//   response.status(status).send({
//     status,
//     message,
//   });
// }

// export default errorMiddleware;
