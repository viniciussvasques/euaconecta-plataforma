"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApiRoutes = configureApiRoutes;
const express_1 = __importDefault(require("express"));
const userRoutes_1 = require("./userRoutes");
function configureApiRoutes(prisma) {
    const router = express_1.default.Router();
    router.get('/health', (_, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    });
    router.use('/users', (0, userRoutes_1.createUserRouter)(prisma));
    return router;
}
//# sourceMappingURL=index.js.map