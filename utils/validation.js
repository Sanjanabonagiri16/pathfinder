import Joi from 'joi';

export const validateLoginInput = (data) => {
  const schema = Joi.object({
    email: Joi.string().pattern(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')).required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(data);
};

export const validateRegisterInput = (data) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().pattern(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')).required(),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d!@#$%^&*()_+]{8,}$')).required(),
  });

  return schema.validate(data);
};