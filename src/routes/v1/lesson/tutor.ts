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
import { isAuthenticated } from '../../../helpers/auth';
import UserRepo from '../../../database/repository/userRepo';
import { Types } from 'mongoose';

const router = express.Router();
export const newLesson = router.post(
  '/new',
  validator(schema.newLesson),
  isAuthenticated,
  async (req: Request, res: Response): Promise<Response> => {
    const id = res.locals.payload;
    let msg;
    try {
      const findLesson = await LessonRepo.findLessonByTitle(
        req.body.courseTitle,
      );
      if (findLesson) throw new InternalErrorResponse('Lesson already exists');
      const findUser = await UserRepo.findUserByID(id);
      if (!findUser) throw new InternalErrorResponse('Unauthorized Access');
      if (findUser.roles != 'TUTOR') {
        throw new InternalErrorResponse(
          'You are not allowed to  create a Lesson',
        );
      }
      const createdLesson = await LessonRepo.Create({
        courseTitle: req.body.courseTitle,
        courseContent: req.body.courseContent,
        courseInstructor: findUser.name,
        courseCode: `${req.body.category}/${req.body.courseTitle}/${findUser.name.length}`,
        description: req.body.description,
        isPublished: req.body.isPublished,
        category: req.body.category,
        owner: res.locals.payload,
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
//  "courseTitle": "Lesson102",

export const updateLesson = router.put(
  '/update/:id',
  validator(schema.newLesson),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const lesson = await LessonRepo.findLessonByID(req.params.id);
    if(!lesson) throw new InternalErrorResponse('Blog does not exists');
    if (!lesson.owner.equals(res.locals.payload)) throw new InternalErrorResponse('You are not permitted to update');
    if (req.body.courseTitle) lesson.courseTitle = req.body.courseTitle 
    if (req.body.category) lesson.category = req.body.category; 
    if (req.body.courseContent) lesson.courseContent = req.body.courseContent; 
    if (req.body.description) lesson.description = req.body.description; 
    await LessonRepo.findAndUpdateLesson(lesson)
    new SuccessResponse(201, 'Blog updated successfully', lesson).send(res);
  }
);
