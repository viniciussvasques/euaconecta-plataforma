"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateUserSchema = exports.loginSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
    role: joi_1.default.string().valid('ADMIN', 'CLIENT').default('CLIENT'),
    preferredLanguage: joi_1.default.string().valid('pt', 'en', 'es').default('pt'),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    preferredLanguage: joi_1.default.string().valid('pt', 'en', 'es').optional(),
}).min(1);
exports.changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(8).required(),
    confirmPassword: joi_1.default.string()
        .valid(joi_1.default.ref('newPassword'))
        .required()
        .messages({ 'any.only': 'passwordMatch' }),
});
//# sourceMappingURL=validation.js.map