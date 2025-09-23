import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Determina o ambiente
const environment = process.env.NODE_ENV || 'development';

// Configurações padrão
const defaultOptions = {
  level: environment === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
};

// Transporter para rotação diária de logs

const fileRotateTransport = new DailyRotateFile({
  filename: path.join(process.cwd(), 'logs', '%DATE%-app.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
});

// Criação do logger
export const logger = winston.createLogger({
  ...defaultOptions,
  transports: [
    // Sempre registra no console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({
            timestamp,
            level,
            message,
            ...meta
          }: {
            timestamp: string;
            level: string;
            message: string;
            [key: string]: unknown;
          }) => {
            return `${timestamp} ${level}: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
          },
        ),
      ),
    }),
  ],
});

// Em produção e homologação, adiciona logging em arquivo
if (['production', 'staging'].includes(environment)) {
  logger.add(fileRotateTransport);
}

// Função para log formatado de erros
export const logError = (error: Error, context?: Record<string, unknown>): void => {
  logger.error(error.message, {
    stack: error.stack,
    ...context,
  });
};
