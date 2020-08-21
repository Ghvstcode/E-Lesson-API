import express, { Request, Response } from 'express';
import LessonRepo from '../../../database/repository/lessonRepo';
import {
  ErrorResponse,
  InternalErrorResponse,
  SuccessResponse,
} from '../../../core/response';
import Lesson from '../../../database/model/Lesson';
import validator from '../../../helpers/validator';
import schema from './schema';
import isAuthenticated from '../../../helpers/auth';

const router = express.Router();
export default router.post(
  '/new',
  validator(schema.newLesson),
  isAuthenticated,
  async (req: Request, res: Response): Promise<Response> => {
    let msg;
    try {
      const foundLesson = await LessonRepo.findLessonByTitle(
        req.body.courseTitle,
      );
      if (foundLesson) throw new InternalErrorResponse('Lesson already exists');
      const createdLesson = await LessonRepo.Create({
        courseTitle: req.body.courseTitle,
        courseContent: req.body.courseContent,
        //courseInstructor: req.user.name,
        description: req.body.description,
        isPublished: req.body.isPublished,
        category: req.body.category,
        //owner: req.user._id
      } as Lesson);

      if (createdLesson.isPublished) {
        msg = 'Published new lesson';
      } else {
        msg = 'Created new lesson as draft';
      }

      return new SuccessResponse(201, msg, {
        createdLesson,
      }).send(res);
    } catch (e) {
      return new ErrorResponse(500, e).send(res);
    }
  },
);
