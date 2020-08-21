import Joi from '@hapi/joi';
export default {
  newLesson: Joi.object().keys({
    courseTitle: Joi.string().required(),
    courseContent: Joi.string().required(),
    description: Joi.string().required().max(350),
    category: Joi.string().required(),
  }),
  //   login: Joi.object().keys({
  //     email: Joi.string().required().email(),
  //     password: Joi.string().required().min(6),
  //   }),
};
