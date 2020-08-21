import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../core/response';

export default (schema: Joi.ObjectSchema) => (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  try {
    const { error } = schema.validate(req.body);
    if (!error) return next();

    const { details } = error;
    const message = details
      .map((i) => i.message.replace(/['"]+/g, ''))
      .join(',');

    next(new ErrorResponse(400, message));
  } catch (error) {
    next(error);
  }
};
