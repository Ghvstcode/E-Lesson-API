import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, InternalErrorResponse } from '../core/response';

export default (schema: Joi.ObjectSchema) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error } = schema.validate(req.body);
    if (!error) return next();

    const { details } = error;
    const message = details
      .map((i) => i.message.replace(/['"]+/g, ''))
      .join(',');
    //next();
    console.log(message);
    throw new InternalErrorResponse(message);
  } catch (error) {
    //new ErrorResponse(500, error).send(res);
    return next(error);
  }
};
