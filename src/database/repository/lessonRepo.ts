import Lesson, { lessonModel } from '../model/Lesson';
import UserRepo from './userRepo';

export default class LessonRepo {
  public static async Create(lesson: Lesson): Promise<Lesson> {
    const now = new Date();
    if (lesson.isPublished) {
      lesson.publishedAt = now;
    }
    lesson.createdAt = now;
    lesson.updatedAt = now;
    const createdBlog = await lessonModel.create(lesson);
    return createdBlog.toObject();
  }

  public static findLessonByTitle(title: string): Promise<Lesson | null> {
    return lessonModel.findOne({ courseTitle: title }).lean<Lesson>().exec();
  }

  public static findLessonByID(id: string): Promise<Lesson | null> {
    return lessonModel.findOne({ _id: id }).lean<Lesson>().exec();
  }

  public static async findAllPublishedLessons(
    id: string,
  ): Promise<Lesson[] | null> {
    const findUser = await UserRepo.findUserByID(id);
    if (findUser) {
      return lessonModel
        .find({ owner: findUser, isPublished: true })
        .lean<Lesson>()
        .exec();
    }
    return null;
  }

  public static async findAllDraftedLessons(
    id: string,
  ): Promise<Lesson[] | null> {
    const findUser = await UserRepo.findUserByID(id);
    if (findUser) {
      return lessonModel
        .find({ owner: findUser, isPublished: false })
        .lean<Lesson>()
        .exec();
    }
    return null;
  }

  public static findAndUpdateLesson(
    lesson: Lesson,
  ): Promise<Lesson | Lesson[] | null> {
    lesson.updatedAt = new Date();
    return lessonModel
      .updateOne({ _id: lesson._id }, { $set: { ...lesson } })
      .lean<Lesson>()
      .exec();
  }
}
