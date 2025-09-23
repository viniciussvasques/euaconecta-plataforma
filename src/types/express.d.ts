/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from 'express';
import { TFunction } from 'i18next';

/**
 * Estende a interface Request do Express para incluir propriedades personalizadas
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * ID único da requisição para rastreamento
       */
      requestId?: string;

      /**
       * Função de tradução
       */
      t: TFunction;

      /**
       * Código do idioma atual (pt, en, es)
       */
      language: string;

      /**
       * Lista de idiomas aceitos pelo cliente em ordem de preferência
       */
      languages: string[];

      /**
       * Idioma que foi detectado e está sendo usado
       */
      i18n: {
        language: string;
        changeLanguage: (lng: string) => Promise<TFunction>;
        [key: string]: unknown;
      };

      /**
       * Informações do usuário autenticado
       */
      user?: {
        id: string;
        role: string;
        [key: string]: unknown;
      };
    }
  }
}

// This empty export makes the file a module
export {};

export {};
