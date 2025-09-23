"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const userRoutes_1 = require("../../../../src/api/routes/userRoutes");
const authMiddleware_1 = require("../../../../src/middlewares/authMiddleware");
jest.mock('../../../../src/middlewares/authMiddleware', () => ({
    authMiddleware: jest.fn((req, res, next) => next()),
}));
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));
const mockPrisma = {
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};
describe('User Routes Integration Tests', () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use('/api/users', (0, userRoutes_1.createUserRouter)(mockPrisma));
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('GET /api/users', () => {
        it('should return a list of users', async () => {
            const mockUsers = [
                {
                    id: 'user-1',
                    email: 'user1@example.com',
                    firstName: 'User',
                    lastName: 'One',
                    role: 'CLIENT',
                    active: true,
                    emailVerified: true,
                    suiteNumber: 'SUITE001',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'user-2',
                    email: 'user2@example.com',
                    firstName: 'User',
                    lastName: 'Two',
                    role: 'CLIENT',
                    active: true,
                    emailVerified: true,
                    suiteNumber: 'SUITE002',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            mockPrisma.user.findMany.mockResolvedValue(mockUsers);
            const response = await (0, supertest_1.default)(app).get('/api/users');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('users');
            expect(response.body.users).toHaveLength(2);
            expect(mockPrisma.user.findMany).toHaveBeenCalled();
            expect(authMiddleware_1.authMiddleware).toHaveBeenCalled();
        });
        it('should handle errors and return 500 status', async () => {
            mockPrisma.user.findMany.mockRejectedValue(new Error('Database error'));
            const response = await (0, supertest_1.default)(app).get('/api/users');
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message');
            expect(mockPrisma.user.findMany).toHaveBeenCalled();
        });
    });
    describe('POST /api/users', () => {
        it('should create a new user', async () => {
            const newUser = {
                email: 'newuser@example.com',
                firstName: 'New',
                lastName: 'User',
                password: 'Password123!',
            };
            const createdUser = {
                id: 'new-user-id',
                email: 'newuser@example.com',
                firstName: 'New',
                lastName: 'User',
                role: 'CLIENT',
                active: false,
                emailVerified: false,
                suiteNumber: 'SUITE003',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrisma.user.create.mockResolvedValue(createdUser);
            mockPrisma.user.findUnique.mockResolvedValue(null);
            const response = await (0, supertest_1.default)(app).post('/api/users').send(newUser);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('id', 'new-user-id');
            expect(mockPrisma.user.create).toHaveBeenCalled();
            expect(mockPrisma.user.findUnique).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=user.routes.spec.js.map