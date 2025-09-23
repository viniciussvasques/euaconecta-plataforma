"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const errorMiddleware_1 = require("./errorMiddleware");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const formattedErrors = err.issues.map((zodError) => ({
                    path: zodError.path.join('.'),
                    message: zodError.message,
                }));
                const error = new errorMiddleware_1.AppError(`Erro de validação: ${JSON.stringify(formattedErrors)}`, 400);
                next(error);
            }
            else {
                next(err);
            }
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validationMiddleware.js.map