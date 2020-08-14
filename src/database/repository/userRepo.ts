import User, { userModel, Role } from '../model/User';
import { InternalErrorResponse } from 'core/response';
import { jwtSecret } from 'config';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import crypto from 'crypto';

export default class UserRepo {
  private async set(user: User, roleCode: Role): Promise<Document> {
    const now = new Date();
    user.roles = [roleCode];
    user.createdAt = user.updatedAt = now;
    //const createdUser = await userModel.create(user);
    const createdUser = new userModel(user);
    //return { user: createdUser.toObject(), keystore: keystore };
    return createdUser;
  }

  private genAuthToken<T extends UserRepo>(user: Document): T {
    const tokens: T = {} as T;
    const _id = user._id.toString();
    const realUser = user.toObject();
    const Acesstoken = jwt.sign(_id, jwtSecret!, { expiresIn: '10m' });
    const Refreshtoken = crypto.randomBytes(20).toString('hex');
    realUser.token = realUser.token.concat(
      { Acesstoken: Acesstoken },
      { Refreshtoken: Refreshtoken },
    );
    Object.assign(tokens, Refreshtoken, Acesstoken);
    return tokens;
  }

  public async Create(
    user: User,
    roleCode: Role,
  ): Promise<{ user: User; tokens: Object }> {
    const createdUser = await this.set(user, roleCode);
    const tokens = this.genAuthToken(createdUser);
    await createdUser.save();
    return { user: createdUser.toObject(), tokens: tokens };
  }
}
