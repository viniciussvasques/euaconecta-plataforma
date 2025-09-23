"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslation = exports.translateErrorMessage = exports.configureI18n = void 0;
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const path_1 = __importDefault(require("path"));
const configureI18n = async () => {
    await i18next_1.default
        .use(i18next_fs_backend_1.default)
        .use(i18next_http_middleware_1.default.LanguageDetector)
        .init({
        fallbackLng: 'pt',
        supportedLngs: ['pt', 'en', 'es'],
        ns: ['translation'],
        defaultNS: 'translation',
        backend: {
            loadPath: path_1.default.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
        },
        detection: {
            order: ['header', 'querystring', 'cookie'],
            lookupHeader: 'accept-language',
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            caches: ['cookie'],
        },
    });
    return i18next_http_middleware_1.default.handle(i18next_1.default);
};
exports.configureI18n = configureI18n;
const translateErrorMessage = (key, options = {}, req) => {
    if (!req) {
        return key;
    }
    return req.t(key, options);
};
exports.translateErrorMessage = translateErrorMessage;
const useTranslation = (lng = 'pt') => {
    return {
        t: (key, options = {}) => {
            return i18next_1.default.getFixedT(lng)(key, options);
        },
        i18n: i18next_1.default,
        changeLanguage: (newLng) => i18next_1.default.changeLanguage(newLng),
    };
};
exports.useTranslation = useTranslation;
exports.default = { configureI18n: exports.configureI18n, translateErrorMessage: exports.translateErrorMessage, useTranslation: exports.useTranslation };
//# sourceMappingURL=i18nConfig.js.map