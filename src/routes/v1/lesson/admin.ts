import validator from '../../../helpers/validator';
import schema from './schema';
import { isAuthenticated } from '../../../helpers/auth';
import express, { Request, Response } from 'express';
import LessonRepo from '../../../database/repository/lessonRepo';
import {
  InternalErrorResponse,
  SuccessResponse,
  ErrorResponse,
} from '../../../core/response';
import UserRepo from '../../../database/repository/userRepo';

const router = express.Router();

export const unpublishLesson = router.put(
  '/unpublish/:id',
  validator(schema.newLesson),
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const lesson = await LessonRepo.findLessonByID(req.params.id);
      if (!lesson) throw new InternalErrorResponse('Lesson does not exists');

      const id = res.locals.payload;
      const findUser = await UserRepo.findUserByID(id);
      if (!findUser) throw new InternalErrorResponse('Unauthorized Access');
      if (findUser.roles != 'ADMIN') {
        throw new InternalErrorResponse('You are not an ADMIN');
      }
      lesson.isPublished = false;
      await LessonRepo.findAndUpdateLesson(lesson);
      new SuccessResponse(201, 'Unpublished the article', lesson).send(res);
    } catch (e) {
      return new ErrorResponse(500, e).send(res);
    }
  },
);
