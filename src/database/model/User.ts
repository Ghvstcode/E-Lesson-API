import { model, Schema, Document } from 'mongoose';
//import Role from './Role';
export const enum Role {
  ADMIN = 'ADMIN',
  TUTOR = 'TUTOR',
  STUDENT = 'STUDENT',
}
export default interface User extends Document {
  name: string;
  email?: string;
  password?: string;
  profilePicUrl?: string;
  roles: Role[];
  tokens: [];
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
      // validate(value: string) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error('Provide a valid email');
      //   }
      // },
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    roles: {
      type: Schema.Types.String,
      required: true,
    },
    tokens: [
      {
        acessToken: {
          type: String,
          required: true,
        },
        refreshToken: {
          type: String,
          required: true,
        },
      },
    ],
    verified: {
      type: Schema.Types.Boolean,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

export const userModel = model('User', UserSchema);
