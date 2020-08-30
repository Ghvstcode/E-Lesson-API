import User, { userModel } from '../model/User';
import { jwtSecret } from '../../config';
import jwt from 'jsonwebtoken';

export default class UserRepo {
  private static async set(user: User): Promise<User> {
    const now = new Date();

    user.createdAt = user.updatedAt = now;
    const createdUser = new userModel(user);

    return createdUser;
  }

  public static genAuthToken(user: User): Record<string, unknown> {
    const token = {};
    const realUser = user.toObject();
    //const realUser = user.toObject();
    const secret: string = jwtSecret!;
    const tokens = {
      Acesstoken: jwt.sign({ id: realUser._id, rf: false }, secret, {
        expiresIn: '2h',
      }),
      refreshtoken: jwt.sign({ id: realUser._id, rf: true }, secret, {
        expiresIn: '10days',
      }),
    };

    Object.assign(token, tokens);
    return token;
  }

  public static async Create(
    user: User,
  ): Promise<{ user: User; tokens: Record<string, unknown> }> {
    const createdUser = await this.set(user);
    const tokens = this.genAuthToken(createdUser);
    await createdUser.save();
    return { user: createdUser.toObject(), tokens: tokens };
  }

  public static async findUserByEmail(email: string): Promise<User | null> {
    const reUser = await userModel
      .findOne({ email: email })
      .lean<User>()
      .exec();
    return reUser;
  }

  public static async findUserByID(Id: string): Promise<User | null> {
    const reUser = await userModel.findOne({ _id: Id }).lean<User>().exec();
    return reUser;
  }
}
