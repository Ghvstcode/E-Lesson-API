import express, { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import UserRepo from '../../../database/repository/userRepo';
import {
  ErrorResponse,
  SuccessResponse,
  InternalErrorResponse,
} from '../../../core/response';
import User from '../../../database/model/User';
import validator from '../../../helpers/validator';
import schema from './schema';

const router = express.Router();

export default router.post(
  '/signup',
  validator(schema.signup),
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await UserRepo.findUserByEmail(req.body.email);
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
      return new SuccessResponse(201, 'Created New User', {
        createdUser,
        tokens,
      }).send(res);
    } catch (e) {
      return new ErrorResponse(500, e).send(res);
    }
  },
);
