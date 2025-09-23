"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = require("body-parser");
const client_1 = require("@prisma/client");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const loggerMiddleware_1 = require("./middlewares/loggerMiddleware");
const logger_1 = require("./utils/logger");
const routes_1 = require("./api/routes");
const schema_1 = require("./graphql/schema");
const i18nConfig_1 = require("./infrastructure/i18n/i18nConfig");
const userRoutes_1 = require("./modules/user/infrastructure/userRoutes");
dotenv_1.default.config();
exports.prisma = new client_1.PrismaClient();
async function bootstrap() {
    const app = (0, express_1.default)();
    const PORT = process.env.PORT || 3000;
    const i18nMiddleware = await (0, i18nConfig_1.configureI18n)();
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }));
    app.use((0, cors_1.default)());
    app.use((0, body_parser_1.json)());
    app.use(loggerMiddleware_1.loggerMiddleware);
    app.use(i18nMiddleware);
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date(),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            language: req.language || 'pt',
        });
    });
    app.get('/api/test-i18n', (req, res) => {
        res.json({
            message: req.t('common.welcome'),
            language: req.language,
            supportedLanguages: ['pt', 'en', 'es'],
        });
    });
    const apolloServer = new server_1.ApolloServer({
        schema: schema_1.schema,
        formatError: (error) => {
            logger_1.logger.error('GraphQL Error', { error });
            return {
                message: error.message,
                path: error.path,
                extensions: process.env.NODE_ENV === 'production'
                    ? { code: error.extensions?.code || 'INTERNAL_SERVER_ERROR' }
                    : error.extensions,
            };
        },
        introspection: process.env.NODE_ENV !== 'production',
    });
    await apolloServer.start();
    app.use('/graphql', (0, express4_1.expressMiddleware)(apolloServer, {
        context: async ({ req }) => ({
            prisma: exports.prisma,
            user: req.user,
        }),
    }));
    app.use('/api', (0, routes_1.configureApiRoutes)(exports.prisma));
    app.use('/api/users', (0, userRoutes_1.userRoutes)());
    app.use(errorMiddleware_1.errorMiddleware);
    app.listen(PORT, () => {
        logger_1.logger.info(`🚀 Servidor rodando em http://localhost:${PORT}`);
        logger_1.logger.info(`🚀 API REST disponível em http://localhost:${PORT}/api`);
        logger_1.logger.info(`🚀 GraphQL disponível em http://localhost:${PORT}/graphql`);
        logger_1.logger.info(`🚀 Internacionalização (i18n) configurada para: PT, EN, ES`);
    });
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}
async function shutdown() {
    logger_1.logger.info('Encerrando servidor...');
    try {
        await exports.prisma.$disconnect();
        logger_1.logger.info('Conexão com o banco de dados encerrada');
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error('Erro ao encerrar servidor:', error);
        process.exit(1);
    }
}
bootstrap().catch((error) => {
    logger_1.logger.error('Erro ao inicializar o servidor:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map