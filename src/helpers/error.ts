import { NextFunction, Request, Response } from 'express';
import HttpException from '../core/response';

export default (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
): Response => {
  let statusCode: number;
  if (!error.statusCode) {
    statusCode = 401;
  } else {
    statusCode = error.statusCode;
  }
  return response.status(statusCode).send({
    status: error.status,
    statusCode: error.statusCode,
    message: error.message,
  });
};
