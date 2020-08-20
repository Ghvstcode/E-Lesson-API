import { model, Schema, Document } from 'mongoose';

export default interface User extends Document {
  name: string;
  email?: string;
  password?: string;
  profilePicUrl?: string;
  roles: string;
  verified?: boolean;
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
      required: true,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    roles: {
      type: Schema.Types.String,
      required: true,
      enum: ['ADMIN', 'TUTOR', 'STUDENT'],
    },
    verified: {
      type: Schema.Types.Boolean,
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

export const userModel = model<User>('User', UserSchema);
