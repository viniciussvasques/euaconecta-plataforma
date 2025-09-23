import Joi from 'joi';
import { ICreateUserDto, ILoginDto, IUpdateUserDto, IChangePasswordDto } from '../domain/user';
export declare const createUserSchema: Joi.ObjectSchema<ICreateUserDto>;
export declare const loginSchema: Joi.ObjectSchema<ILoginDto>;
export declare const updateUserSchema: Joi.ObjectSchema<IUpdateUserDto>;
export declare const changePasswordSchema: Joi.ObjectSchema<IChangePasswordDto>;
