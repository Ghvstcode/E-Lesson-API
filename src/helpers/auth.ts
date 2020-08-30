import { Response, NextFunction, Request } from 'express';
import Jwt from 'jsonwebtoken';
import { ErrorResponse } from '../core/response';
import { jwtSecret } from '../config';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token == undefined)
      throw new ErrorResponse(403, 'Malformed Auth token');
    const decoded = <Record<string, unknown>>Jwt.verify(token, jwtSecret!);
    if (decoded.rf) throw new ErrorResponse(401, 'UnAuthorized!');
    res.locals.payload = decoded.id;
    next();
  } catch (error) {
    next(error);
  }
};
