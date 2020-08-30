import express from 'express';
import basicSignup from './access/signup';
import login, { refreshToken } from './access/login';
import {
  newLesson,
  updateLesson,
  getAllPublished,
  publishLesson,
  getAllDrafts,
} from './lesson/tutor';
import { unpublishLesson } from './lesson/admin';

const router = express.Router();

router.use('/user', basicSignup);
router.use('/user', login);
router.use('/user', getAllPublished);
router.use('/user', getAllDrafts);
router.use('/user', refreshToken);
router.use('/lesson', newLesson);
router.use('/lesson', updateLesson);
router.use('/lesson', unpublishLesson);
router.use('/lesson', publishLesson);

export default router;
