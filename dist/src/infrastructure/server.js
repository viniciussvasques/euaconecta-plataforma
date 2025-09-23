"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupServer = void 0;
const express_1 = __importDefault(require("express"));
const i18nConfig_1 = require("./i18n/i18nConfig");
const setupServer = async () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    });
    const i18nMiddleware = await (0, i18nConfig_1.configureI18n)();
    app.use(i18nMiddleware);
    app.use((req, res, next) => {
        res.header('X-Content-Type-Options', 'nosniff');
        res.header('X-Frame-Options', 'DENY');
        res.header('X-XSS-Protection', '1; mode=block');
        next();
    });
    app.use((req, res, next) => {
        const language = req.language || 'pt';
        res.setHeader('Content-Language', language);
        next();
    });
    app.get('/api/test-i18n', (req, res) => {
        res.json({
            message: req.t('common.welcome'),
            language: req.language,
            supportedLanguages: ['pt', 'en', 'es'],
        });
    });
    return app;
};
exports.setupServer = setupServer;
exports.default = exports.setupServer;
//# sourceMappingURL=server.js.map