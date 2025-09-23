import { Request, Response, NextFunction } from 'express';
import Joi, { ValidationError } from 'joi';
import { translateErrorMessage } from '../i18n/i18nConfig';

/**
 * Middleware para validação de dados de requisição com mensagens internacionalizadas
 * @param {Function} validationSchema - Schema Joi para validação
 * @returns {Function} Middleware Express
 */
export const validate = (validationSchema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Executa a validação com o schema fornecido
      const { error } = validationSchema.validate(req.body, { abortEarly: false });

      if (error) {
        const validationErrors = mapValidationErrors(error, req);
        return res.status(400).json({ errors: validationErrors });
      }

      next();
    } catch (err) {
      console.error('Erro no middleware de validação:', err);
      return res.status(500).json({
        message: translateErrorMessage('errors.serverError', {}, req),
      });
    }
  };
};

/**
 * Mapeia erros de validação do Joi para mensagens internacionalizadas
 * @param {ValidationError} error - Erro de validação Joi
 * @param {Request} req - Objeto de requisição Express
 * @returns {Array} Array de objetos de erro formatados
 */
const mapValidationErrors = (error: ValidationError, req: Request) => {
  return error.details.map((detail: Joi.ValidationErrorItem) => {
    // Extrai informações do erro
    const path = detail.path.join('.');
    const type = detail.type.split('.')[1];
    let translationKey = '';

    // Mapeia o tipo de erro para a chave de tradução correspondente
    switch (type) {
      case 'required':
        translationKey = 'validation.required';
        break;
      case 'email':
        translationKey = 'validation.email';
        break;
      case 'min':
        translationKey = 'validation.minLength';
        break;
      case 'max':
        translationKey = 'validation.maxLength';
        break;
      default:
        // Usa a mensagem original caso não haja tradução
        return { path, message: detail.message };
    }

    // Constrói as opções para a tradução
    const options: Record<string, any> = { field: path };
    if (type === 'min') {
      options.min = detail.context?.limit;
    }
    if (type === 'max') {
      options.max = detail.context?.limit;
    }

    // Retorna o erro com a mensagem traduzida
    return {
      path,
      message: translateErrorMessage(translationKey, options, req),
    };
  });
};

export default validate;
