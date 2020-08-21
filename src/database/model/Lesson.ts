import { model, Schema, Document } from 'mongoose';
import User from './User';
export default interface Lesson extends Document {
  courseTitle: string;
  courseCode: string;
  courseContent: string;
  courseInstructor: string;
  description: string;
  isPublished?: boolean;
  publishedAt?: Date;
  tags: string[];
  owner: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const LessonSchema = new Schema(
  {
    courseTitle: {
      type: Schema.Types.String,
      required: true,
    },
    courseCode: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
    },
    courseInstructor: {
      type: Schema.Types.String,
      required: true,
    },
    courseContent: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
      maxlength: 350,
    },
    isPublished: {
      type: Schema.Types.Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      required: true,
      select: false,
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

export const lessonModel = model<Lesson>('Lesson', LessonSchema);
