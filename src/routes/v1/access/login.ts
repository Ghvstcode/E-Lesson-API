import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { jwtSecret } from '../../../config';
import UserRepo from '../../../database/repository/userRepo';
import {
  InternalErrorResponse,
  SuccessResponse,
  ErrorResponse,
} from '../../../core/response';
import User, { userModel } from '../../../database/model/User';
import validator from '../../../helpers/validator';
import schema from './schema';

const router = express.Router();

export default router.post(
  '/login',
  validator(schema.login),
  async (req: Request, res: Response): Promise<Response> => {
    const find = async (): Promise<User> => {
      const a = await userModel.findOne(
        { email: req.body.email },
        (err, doc) => {
          if (err) throw new InternalErrorResponse(err);
          if (!doc) throw new InternalErrorResponse('User does not exist');
          return { doc };
        },
      );
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
  },
);

export const refreshToken = router.get(
  '/refresh/:token',
  async (req: Request, res: Response) => {
    try {
      const propToken = <Record<string, undefined>>(
        Jwt.verify(req.params.token, jwtSecret!)
      );
      if (!propToken.rf) throw new ErrorResponse(401, 'Invalid Token!');
      //if (typeof propToken.rf === "unknown") throw new ErrorResponse(401, 'Invalid Token!');
      const id: string = propToken.id!;
      const findUser = await UserRepo.findUserByID(id);
      if (!findUser) throw new InternalErrorResponse('Unauthorized Access');
      const tokens = UserRepo.genAuthToken(findUser);
      findUser.password = '';
      return new SuccessResponse(200, 'Logged in User', {
        findUser,
        tokens,
      }).send(res);
    } catch (e) {
      return new ErrorResponse(500, e).send(res);
    }
  },
);
