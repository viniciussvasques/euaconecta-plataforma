import winston from 'winston';
export declare const logger: winston.Logger;
export declare const logError: (error: Error, context?: Record<string, unknown>) => void;
