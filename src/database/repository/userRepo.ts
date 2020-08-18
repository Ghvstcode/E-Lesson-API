import User, { userModel, Role } from '../model/User';
import { InternalErrorResponse } from '../../core/response';
import { jwtSecret } from '../../config';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import crypto from 'crypto';

export default class UserRepo {
  private static async set(user: User, roleCode: string): Promise<Document> {
    const now = new Date();
    user.roles = roleCode;
    user.createdAt = user.updatedAt = now;
    //const createdUser = await userModel.create(user);
    const createdUser = new userModel(user);
    //return { user: createdUser.toObject(), keystore: keystore };
    return createdUser;
  }

  private static genAuthToken(user: Document): Object {
    const tokens = {};
    // const name = user.toObject();
    //console.log('id', _id);
    const realUser = user.toObject();
    const Acesstoken = jwt.sign(realUser.name, jwtSecret!);
    const Refreshtoken = crypto.randomBytes(20).toString('hex');
    realUser.token = realUser.token.push(
      { Acesstoken: Acesstoken },
      { Refreshtoken: Refreshtoken },
    );
    Object.assign(tokens, Refreshtoken, Acesstoken);
    return tokens;
  }

  public static async Create(
    user: User,
    roleCode: string,
  ): Promise<{ user: User; tokens: Object }> {
    const createdUser = await this.set(user, roleCode);
    console.log(createdUser);
    const tokens = this.genAuthToken(createdUser);
    await createdUser.save();
    return { user: createdUser.toObject(), tokens: tokens };
  }

  public static async findByEmail(email: string): Promise<User | null> {
    const reUser = await userModel
      .findOne({ email: email })
      .lean<User>()
      .exec();
    return reUser;
  }
}
