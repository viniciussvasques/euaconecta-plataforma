"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const logger_1 = require("../utils/logger");
const uuid_1 = require("uuid");
const loggerMiddleware = (req, res, next) => {
    const requestId = (0, uuid_1.v4)();
    req.requestId = requestId;
    const startTime = Date.now();
    logger_1.logger.info(`Requisição iniciada: ${req.method} ${req.path}`, {
        requestId,
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.id || 'anônimo',
    });
    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
        logger_1.logger[logLevel](`Requisição finalizada: ${req.method} ${req.path} - ${res.statusCode}`, {
            requestId,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`,
        });
    });
    next();
};
exports.loggerMiddleware = loggerMiddleware;
//# sourceMappingURL=loggerMiddleware.js.map