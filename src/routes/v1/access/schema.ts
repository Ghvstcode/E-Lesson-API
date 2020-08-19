import Joi from '@hapi/joi';
export default {
  signup: Joi.object().keys({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    roles: Joi.string().required(),
    profilePicUrl: Joi.string().optional().uri(),
  }),
};
