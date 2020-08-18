import express, { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import validator from '../../../helpers/validator';
import UserRepo from '../../../database/repository/userRepo';
import { ErrorResponse, SuccessResponse } from '../../../core/response';
import { RoleCode } from 'database/model/Role';
import User from 'database/model/User';

// const router = express.Router();

//router.post('/basic', validator(schema.signup));
export const basicSignup = async (req: Request, res: Response) => {
  try {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new ErrorResponse(400, 'User already Exists');

    const password = await bcrypt.hash(req.body.password, 10);

    const { user: createdUser, tokens } = await UserRepo.Create(
      {
        name: req.body.name,
        email: req.body.email,
        password,
        profilePicUrl: req.body.profilePicUrl,
      } as User,
      RoleCode.STUDENT,
    );
    new SuccessResponse(201, 'Created New User', { user, tokens }).send(res);
  } catch (e) {
    console.log(e);
    new ErrorResponse(500, e).send(res);
  }
};
