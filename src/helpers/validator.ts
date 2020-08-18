import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import logger from '../core/logger';
import { ErrorResponse } from '../core/response';

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

    next(new ErrorResponse(400, message).send(res));
  } catch (error) {
    console.log(error);
    next(error);
  }
};
