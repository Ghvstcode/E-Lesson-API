import express from 'express';
import { basicSignup } from './access/signup';
import { login } from './access/login';
import schema from './access/schema';
import validator from '../../helpers/validator';
import isAuthenticated from '../../helpers/auth';

const router = express.Router();

router.use('/signup', validator(schema.signup), basicSignup);
router.use('/login', validator(schema.login), login);
router.use('/newlesson', validator(schema.login), isAuthenticated, login);
// router.use('/login', validator(schema.login), login);
// router.use('/publish/:id', validator(schema.login), login);
// router.use('/unpublish/:id', validator(schema.login), login);
// router.use('/drafts', validator(schema.login), login);
// router.use('/token', validator(schema.login), login);

export default router;
