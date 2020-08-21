// const jwt = require('jsonwebtoken');
// const User = require('../Models/User');
// const githubUser = require('../Models/GithubUser');

// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.verify(token, 'blueferrari'); //REMEMBER TO HIDE SECRET
//     const user = await User.findOne({
//       _id: decoded._id,
//       'tokens.token': token,
//     });
//     const socialUser = await githubUser.findOne({ token: token });
//     if (!user || !socialUser) {
//       throw new Error();
//     }

//     req.token = token;
//     req.user = user;
//     next();
//   } catch (e) {
//     res.status(401).send({ error: 'Please authenticate' });
//   }
// };

import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import logger from '../core/logger';
import { ErrorResponse, InternalErrorResponse } from '../core/response';
import { jwtSecret } from '../config';
import { userModel } from 'database/model/User';

export default () => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('Helloauth');
    // const token = req.headers.Authorization.replace('Bearer ', '');
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token == undefined)
      throw new InternalErrorResponse('Malformed Auth token');
    const decoded = Jwt.verify(token, jwtSecret!);
    console.log('Auth', req.body);
    console.log(decoded);
    throw new InternalErrorResponse('UnAuthorized!');
    return next();
    // if(!decoded.rf){
    //     throw new InternalErrorResponse('UnAuthorized!');
    // }
    // const user = await userModel.findOne({
    // _id: decoded.id,
    // });
    // req.user = user
  } catch (error) {
    new ErrorResponse(500, 'errorfromauth').send(res);
    return next();
  }
};
