import Lesson, { lessonModel } from '../model/Lesson';

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
}
