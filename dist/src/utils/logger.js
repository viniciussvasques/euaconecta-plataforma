"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const environment = process.env.NODE_ENV || 'development';
const defaultOptions = {
    level: environment === 'production' ? 'info' : 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
};
const fileRotateTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(process.cwd(), 'logs', '%DATE%-app.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
});
exports.logger = winston_1.default.createLogger({
    ...defaultOptions,
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
                return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
            })),
        }),
    ],
});
if (['production', 'staging'].includes(environment)) {
    exports.logger.add(fileRotateTransport);
}
const logError = (error, context) => {
    exports.logger.error(error.message, {
        stack: error.stack,
        ...context,
    });
};
exports.logError = logError;
//# sourceMappingURL=logger.js.map