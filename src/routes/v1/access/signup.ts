import express, { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import validator from '../../../helpers/validator';
import schema from './schema';
import userRepo from 'database/repository/userRepo';
import { ErrorResponse, SuccessResponse } from 'core/response';
import { RoleCode } from 'database/model/Role';
import User from 'database/model/User';

// const router = express.Router();

//router.post('/basic', validator(schema.signup));
export const basicSignup = async (req: Request, res: Response) => {
  try {
    const user = await userRepo.findByEmail(req.body.email);
    console.log('You are testing to see if the user is null', user);
    if (user) throw new ErrorResponse(400, 'User already Exists');

    const password = await bcrypt.hash(req.body.password, 10);

    const { user: createdUser, tokens } = await userRepo.Create(
      {
        name: req.body.name,
        email: req.body.email,
        password,
        profilePicUrl: req.body.profilePicUrl,
      } as User,
      RoleCode.STUDENT,
    );
    new SuccessResponse(201, 'Created New User', { user, tokens });
  } catch (e) {
    new ErrorResponse(500, e);
  }
};
