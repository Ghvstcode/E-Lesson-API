import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import UserRepo from '../../../database/repository/userRepo';
import {
  InternalErrorResponse,
  SuccessResponse,
  ErrorResponse,
} from '../../../core/response';

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new InternalErrorResponse('User does not exist');
    if (!req.body.password)
      throw new InternalErrorResponse('User does not exist');

    const match = await bcrypt.compare(req.body.password, user.password!);
    if (!match) throw new InternalErrorResponse('Authentication failure');

    const tokens = UserRepo.genAuthToken(user);
    return new SuccessResponse(201, 'Created New User', {
      user,
      tokens,
    }).send(res);
  } catch (e) {
    return new ErrorResponse(500, e).send(res);
  }
};
