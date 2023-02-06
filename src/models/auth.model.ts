import Joi from "joi";
export const CreateUserModel = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});
export const LoginUserModel = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
