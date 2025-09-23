"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const i18nConfig_1 = require("../i18n/i18nConfig");
const validate = (validationSchema) => {
    return (req, res, next) => {
        try {
            const { error } = validationSchema.validate(req.body, { abortEarly: false });
            if (error) {
                const validationErrors = mapValidationErrors(error, req);
                return res.status(400).json({ errors: validationErrors });
            }
            next();
        }
        catch (err) {
            console.error('Erro no middleware de validação:', err);
            return res.status(500).json({
                message: (0, i18nConfig_1.translateErrorMessage)('errors.serverError', {}, req),
            });
        }
    };
};
exports.validate = validate;
const mapValidationErrors = (error, req) => {
    return error.details.map((detail) => {
        const path = detail.path.join('.');
        const type = detail.type.split('.')[1];
        let translationKey = '';
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
                return { path, message: detail.message };
        }
        const options = { field: path };
        if (type === 'min') {
            options.min = detail.context?.limit;
        }
        if (type === 'max') {
            options.max = detail.context?.limit;
        }
        return {
            path,
            message: (0, i18nConfig_1.translateErrorMessage)(translationKey, options, req),
        };
    });
};
exports.default = exports.validate;
//# sourceMappingURL=validationMiddleware.js.map