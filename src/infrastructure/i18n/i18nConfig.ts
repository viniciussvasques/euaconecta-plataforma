import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';

/**
 * Configura o serviço de internacionalização (i18n) para a aplicação
 * Suporta os idiomas: português (pt), inglês (en) e espanhol (es)
 */
export const configureI18n = async () => {
  await i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      fallbackLng: 'pt',
      supportedLngs: ['pt', 'en', 'es'],
      ns: ['translation'],
      defaultNS: 'translation',
      backend: {
        loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
      },
      detection: {
        order: ['header', 'querystring', 'cookie'],
        lookupHeader: 'accept-language',
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        caches: ['cookie'],
      },
    });

  return middleware.handle(i18next);
};

/**
 * Middleware para tradução de mensagens de erro para respostas HTTP
 * @param {string} key - Chave de tradução
 * @param {Record<string, any>} options - Opções para substituição de valores na tradução
 * @param {Request} req - Objeto de requisição Express
 */
export const translateErrorMessage = (key: string, options: Record<string, any> = {}, req: any) => {
  if (!req) {
    return key; // Fallback caso não seja possível traduzir
  }

  return req.t(key, options);
};

/**
 * Hook utilitário para obter traduções em contextos não-HTTP
 * @param {string} lng - Código do idioma (pt, en, es)
 */
export const useTranslation = (lng = 'pt') => {
  return {
    t: (key: string, options: Record<string, any> = {}) => {
      return i18next.getFixedT(lng)(key, options);
    },
    i18n: i18next,
    changeLanguage: (newLng: string) => i18next.changeLanguage(newLng),
  };
};

export default { configureI18n, translateErrorMessage, useTranslation };
