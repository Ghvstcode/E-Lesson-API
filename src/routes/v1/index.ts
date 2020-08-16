import express from 'express';
import { basicSignup } from './access/signup';
import schema from './access/schema';
import validator from '../../helpers/validator';
const router = express.Router();

router.use('/signup/basic', validator(schema.signup), basicSignup);

export default router;
