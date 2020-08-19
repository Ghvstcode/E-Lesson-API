import User, { userModel } from '../model/User';
import { InternalErrorResponse } from '../../core/response';
import { jwtSecret } from '../../config';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import crypto from 'crypto';

export default class UserRepo {
  private static async set(user: User): Promise<Document> {
    const now = new Date();

    user.createdAt = user.updatedAt = now;
    const createdUser = new userModel(user);

    return createdUser;
  }

  private static genAuthToken(user: Document): Record<string, unknown> {
    const token = {};
    const realUser = user.toObject();

    const tokens = {
      Acesstoken: jwt.sign({ name: realUser.name }, jwtSecret!, {
        expiresIn: '2h',
      }),
      refreshtoken: crypto.randomBytes(20).toString('hex'),
    };

    Object.assign(token, tokens);
    return token;
  }

  public static async Create(
    user: User,
  ): Promise<{ user: User; tokens: Object }> {
    const createdUser = await this.set(user);
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
