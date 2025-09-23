import Joi from 'joi';
import { ICreateUserDto, ILoginDto, IUpdateUserDto, IChangePasswordDto } from '../domain/user';

/**
 * Schema de validação para criação de usuário com mensagens internacionalizadas
 */
export const createUserSchema = Joi.object<ICreateUserDto>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('ADMIN', 'CLIENT').default('CLIENT'),
  preferredLanguage: Joi.string().valid('pt', 'en', 'es').default('pt'),
});

/**
 * Schema de validação para login de usuário com mensagens internacionalizadas
 */
export const loginSchema = Joi.object<ILoginDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * Schema de validação para atualização de usuário com mensagens internacionalizadas
 */
export const updateUserSchema = Joi.object<IUpdateUserDto>({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  preferredLanguage: Joi.string().valid('pt', 'en', 'es').optional(),
}).min(1);

/**
 * Schema de validação para alteração de senha com mensagens internacionalizadas
 */
export const changePasswordSchema = Joi.object<IChangePasswordDto>({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({ 'any.only': 'passwordMatch' }),
});
