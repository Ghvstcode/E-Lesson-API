import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { InternalErrorResponse } from '../core/response';

export default (schema: Joi.ObjectSchema) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { error } = schema.validate(req.body);
    if (!error) return next();

    const { details } = error;
    const message = details
      .map((i) => i.message.replace(/['"]+/g, ''))
      .join(',');
    throw new InternalErrorResponse(message);
  } catch (error) {
    return next(error);
  }
};
