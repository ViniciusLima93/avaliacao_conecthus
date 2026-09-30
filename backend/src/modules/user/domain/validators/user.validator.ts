import * as Joi from 'joi';
import { ValidatorInterface } from '../../../../core/domain/validator/validator.interface';
import { UserMessages } from '../../../../core/utils/user-messages';
import type { UserEntity } from '../entities/user.entity';
import { NAME_PATTERN, REGISTRATION_PATTERN } from './user.rules';

const userSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(NAME_PATTERN)
    .required()
    .messages({
      'any.required': UserMessages.NAME_REQUIRED,
      'string.empty': UserMessages.NAME_REQUIRED,
      'string.base': UserMessages.NAME_STRING,
      'string.min': UserMessages.NAME_MIN,
      'string.max': UserMessages.NAME_MAX,
      'string.pattern.base': UserMessages.NAME_LETTERS,
    }),
  registration: Joi.string()
    .trim()
    .min(4)
    .max(10)
    .pattern(REGISTRATION_PATTERN)
    .required()
    .messages({
      'any.required': UserMessages.REGISTRATION_REQUIRED,
      'string.empty': UserMessages.REGISTRATION_REQUIRED,
      'string.base': UserMessages.REGISTRATION_STRING,
      'string.min': UserMessages.REGISTRATION_MIN,
      'string.max': UserMessages.REGISTRATION_MAX,
      'string.pattern.base': UserMessages.REGISTRATION_DIGITS,
    }),
  email: Joi.string().email().max(40).required().messages({
    'any.required': UserMessages.EMAIL_REQUIRED,
    'string.empty': UserMessages.EMAIL_REQUIRED,
    'string.email': UserMessages.EMAIL_INVALID,
    'string.max': UserMessages.EMAIL_MAX,
  }),
  password: Joi.string().required().messages({
    'any.required': UserMessages.PASSWORD_REQUIRED,
    'string.empty': UserMessages.PASSWORD_REQUIRED,
  }),
  isActive: Joi.boolean().required().messages({
    'boolean.base': UserMessages.IS_ACTIVE_BOOLEAN,
  }),
});

export class UserValidator implements ValidatorInterface<UserEntity> {
  validate(entity: UserEntity): void {
    const { error } = userSchema.validate(
      {
        name: entity.name,
        registration: entity.registration,
        email: entity.email,
        password: entity.password,
        isActive: entity.isActive,
      },
      { abortEarly: false },
    );

    error?.details.forEach((detail) =>
      entity.notification.addError({
        context: String(detail.path[0] ?? 'user'),
        message: detail.message,
      }),
    );
  }
}
