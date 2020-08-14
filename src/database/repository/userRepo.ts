import User, { userModel } from '../model/User';
import Role, { RoleModel } from '../model/Role';
export default class UserRepo {
  public static async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    roleCode: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    const now = new Date();

    const role = await RoleModel.findOne({ code: roleCode })
      .select('+email +password')
      .lean<Role>()
      .exec();
    if (!role) {
      throw new InternalError('Role must be defined');
    }

    user.roles = [role._id];
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    const keystore = await KeystoreRepo.create(
      createdUser._id,
      accessTokenKey,
      refreshTokenKey,
    );
    return { user: createdUser.toObject(), keystore: keystore };
  }
}
