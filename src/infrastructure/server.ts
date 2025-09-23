import express, { Express } from 'express';
import { configureI18n } from './i18n/i18nConfig';

/**
 * Configura o servidor Express com middleware de internacionalização
 * @returns {Promise<Express>} - Instância configurada do Express
 */
export const setupServer = async (): Promise<Express> => {
  const app = express();

  // Configuração básica do Express
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Configuração de CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    next();
  });

  // Configuração da internacionalização
  const i18nMiddleware = await configureI18n();
  app.use(i18nMiddleware);

  // Middleware para definir cabeçalhos de segurança
  app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Middleware para verificar idioma e definir nas respostas
  app.use((req, res, next) => {
    const language = req.language || 'pt';
    res.setHeader('Content-Language', language);
    next();
  });

  // Endpoint de teste para verificar a internacionalização
  app.get('/api/test-i18n', (req, res) => {
    res.json({
      message: req.t('common.welcome'),
      language: req.language,
      supportedLanguages: ['pt', 'en', 'es'],
    });
  });

  return app;
};

export default setupServer;
