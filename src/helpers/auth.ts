import { Response, NextFunction, Request } from 'express';
import Jwt from 'jsonwebtoken';
import { InternalErrorResponse } from '../core/response';
import { jwtSecret } from '../config';
import { UserRequest } from '../types/request';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token == undefined)
      throw new InternalErrorResponse('Malformed Auth token');
    const decoded = <Record<string, unknown>>Jwt.verify(token, jwtSecret!);
    if (decoded.rf) throw new InternalErrorResponse('UnAuthorized!');
    res.locals.payload = decoded.id;
    next();
  } catch (error) {
    next(error);
  }
};
