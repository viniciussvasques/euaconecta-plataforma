"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRouter = createUserRouter;
const express_1 = __importDefault(require("express"));
const userService_1 = require("../../services/user/userService");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const userSchema_1 = require("../../models/userSchema");
const errorMiddleware_1 = require("../../middlewares/errorMiddleware");
function createUserRouter(prisma) {
    const router = express_1.default.Router();
    const userService = new userService_1.UserService(prisma);
    router.get('/', (0, authMiddleware_1.authMiddleware)(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
        try {
            const users = await userService.findAllUsers();
            res.status(200).json({ users });
        }
        catch (error) {
            next(error);
        }
    });
    router.get('/:id', (0, authMiddleware_1.authMiddleware)(), async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            if (req.user.id !== id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
                throw new errorMiddleware_1.AppError('Acesso não autorizado', 403);
            }
            const user = await userService.findUserById(id);
            res.status(200).json({ user });
        }
        catch (error) {
            next(error);
        }
    });
    router.post('/', (0, validationMiddleware_1.validateRequest)(userSchema_1.createUserSchema), async (req, res, next) => {
        try {
            const userData = req.body;
            const user = await userService.createUser(userData);
            res.status(201).json({ user });
        }
        catch (error) {
            next(error);
        }
    });
    router.put('/:id', (0, authMiddleware_1.authMiddleware)(), (0, validationMiddleware_1.validateRequest)(userSchema_1.updateUserSchema), async (req, res, next) => {
        try {
            const { id } = req.params;
            const userData = req.body;
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            if (req.user.id !== id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
                throw new errorMiddleware_1.AppError('Acesso não autorizado', 403);
            }
            const user = await userService.updateUser(id, userData);
            res.status(200).json({ user });
        }
        catch (error) {
            next(error);
        }
    });
    router.delete('/:id', (0, authMiddleware_1.authMiddleware)(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
        try {
            const { id } = req.params;
            await userService.deleteUser(id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
//# sourceMappingURL=userRoutes.js.map