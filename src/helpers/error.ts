import { NextFunction, Request, Response } from 'express';
import HttpException from '../core/response';

export default (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
): Response => {
  return response.status(error.statusCode).send({
    status: error.status,
    statusCode: error.statusCode,
    message: error.message,
  });
};
