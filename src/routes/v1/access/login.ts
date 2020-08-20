import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import UserRepo from '../../../database/repository/userRepo';
import {
  InternalErrorResponse,
  SuccessResponse,
  ErrorResponse,
} from '../../../core/response';
import User, { userModel } from '../../../database/model/User';

export const login = async (req: Request, res: Response): Promise<Response> => {
  const find = async (): Promise<User> => {
    const a = await userModel.findOne({ email: req.body.email }, (err, doc) => {
      if (err) throw new InternalErrorResponse(err);
      if (!doc) throw new InternalErrorResponse('User does not exist');
      return { doc };
    });
    return a!;
  };
  try {
    const document = await find();

    const tokens = UserRepo.genAuthToken(document);
    const user = document.toObject();
    if (!req.body.password) {
      throw new InternalErrorResponse('Bad credentials');
    }

    const match = await bcrypt.compare(req.body.password, user.password!);
    if (!match) throw new InternalErrorResponse('Authentication failure');

    user.password = '';
    //const tokens = UserRepo.genAuthToken(user);
    return new SuccessResponse(200, 'Logged in User', {
      user,
      tokens,
    }).send(res);
  } catch (e) {
    return new ErrorResponse(500, e).send(res);
  }
};
