import express from 'express';
import basicSignup from './access/signup';
import login from './access/login';
import { newLesson, updateLesson } from './lesson/tutor';
import schema from './access/schema';
import validator from '../../helpers/validator';

const router = express.Router();

// router.use('/user', basicSignup);
router.use('/user', login);
router.use('/lesson', newLesson);
router.use('/lesson', updateLesson);
// router.use('/login', validator(schema.login), login);
// router.use('/publish/:id', validator(schema.login), login);
// router.use('/unpublish/:id', validator(schema.login), login);
// router.use('/drafts', validator(schema.login), login);
// router.use('/token', validator(schema.login), login);

export default router;
