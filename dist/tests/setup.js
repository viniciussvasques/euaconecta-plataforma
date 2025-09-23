"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMock = void 0;
const client_1 = require("@prisma/client");
const globals_1 = require("@jest/globals");
globals_1.jest.mock('@prisma/client', () => {
    const mPrisma = {
        user: {
            findMany: globals_1.jest.fn(),
            findUnique: globals_1.jest.fn(),
            create: globals_1.jest.fn(),
            update: globals_1.jest.fn(),
            delete: globals_1.jest.fn(),
        },
    };
    return {
        PrismaClient: globals_1.jest.fn(() => mPrisma),
    };
});
exports.prismaMock = new client_1.PrismaClient();
//# sourceMappingURL=setup.js.map