"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../infrastructure/middleware/validationMiddleware");
const validation_1 = require("../application/validation");
const userRoutes = () => {
    const router = express_1.default.Router();
    router.post('/', (0, validationMiddleware_1.validate)(validation_1.createUserSchema), (req, res) => {
        return res.status(201).json({
            message: req.t('user.createSuccess'),
            user: { ...req.body, password: undefined },
        });
    });
    router.post('/login', (0, validationMiddleware_1.validate)(validation_1.loginSchema), (req, res) => {
        return res.status(401).json({
            message: req.t('auth.loginError'),
        });
    });
    router.put('/:id', (0, validationMiddleware_1.validate)(validation_1.updateUserSchema), (req, res) => {
        const { id } = req.params;
        return res.status(200).json({
            message: req.t('user.updateSuccess'),
            user: { id, ...req.body },
        });
    });
    router.put('/:id/password', (0, validationMiddleware_1.validate)(validation_1.changePasswordSchema), (req, res) => {
        const { id } = req.params;
        return res.status(200).json({
            message: req.t('user.passwordUpdateSuccess'),
        });
    });
    router.get('/:id', (req, res) => {
        const { id } = req.params;
        if (id === 'not-found') {
            return res.status(404).json({
                message: req.t('errors.notFound'),
            });
        }
        return res.status(200).json({
            user: {
                id,
                name: 'Usuário Teste',
                email: 'teste@example.com',
                role: 'CLIENT',
                preferredLanguage: req.language,
            },
        });
    });
    return router;
};
exports.userRoutes = userRoutes;
exports.default = exports.userRoutes;
//# sourceMappingURL=userRoutes.js.map