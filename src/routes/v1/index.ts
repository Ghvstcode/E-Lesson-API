import express from 'express';
import { basicSignup } from './access/signup';
import { login } from './access/login';
import schema from './access/schema';
import validator from '../../helpers/validator';

const router = express.Router();

router.use('/signup', validator(schema.signup), basicSignup);
router.use('/login', validator(schema.login), login);

export default router;
