"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorMiddleware = (err, req, res, next) => {
    const statusCode = 'statusCode' in err ? err.statusCode : 500;
    const message = err.message || 'Erro interno no servidor';
    const isOperational = 'isOperational' in err ? err.isOperational : false;
    if (!isOperational) {
        logger_1.logger.error('Erro não operacional', {
            error: err,
            path: req.path,
            method: req.method,
            body: req.body,
            params: req.params,
            query: req.query,
            user: req.user,
        });
    }
    else {
        logger_1.logger.warn(`${statusCode} - ${message}`, {
            path: req.path,
            method: req.method,
        });
    }
    if (process.env.NODE_ENV === 'development') {
        return res.status(statusCode).json({
            status: 'error',
            message,
            stack: err.stack,
            ...(isOperational ? {} : { code: 'INTERNAL_SERVER_ERROR' }),
        });
    }
    return res.status(statusCode).json({
        status: 'error',
        message: isOperational
            ? message
            : 'Ocorreu um erro interno. Por favor tente novamente mais tarde.',
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map