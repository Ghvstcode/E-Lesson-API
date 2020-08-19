import express, { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import validator from '../../../helpers/validator';
import UserRepo from '../../../database/repository/userRepo';
import {
  ErrorResponse,
  SuccessResponse,
  SuccessMsgResponse,
  InternalErrorResponse,
} from '../../../core/response';
import User from '../../../database/model/User';

// const router = express.Router();

//router.post('/basic', validator(schema.signup));
export const basicSignup = async (req: Request, res: Response) => {
  try {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new InternalErrorResponse('User already Exists');

    const password = await bcrypt.hash(req.body.password, 10);

    const { user: createdUser, tokens } = await UserRepo.Create({
      name: req.body.name,
      email: req.body.email,
      roles: req.body.roles,
      password,
      profilePicUrl: req.body.profilePicUrl,
    } as User);
    createdUser.password = '';
    new SuccessResponse(201, 'Created New User', { createdUser, tokens }).send(
      res,
    );
  } catch (e) {
    console.log('signupcatche', e);
    new ErrorResponse(500, e).send(res);
  }
};
