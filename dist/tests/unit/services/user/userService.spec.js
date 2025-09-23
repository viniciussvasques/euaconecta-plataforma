"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = require("../../../setup");
const userService_1 = require("../../../../src/services/user/userService");
const errorMiddleware_1 = require("../../../../src/middlewares/errorMiddleware");
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true),
}));
describe('UserService', () => {
    let userService;
    beforeEach(() => {
        userService = new userService_1.UserService(setup_1.prismaMock);
    });
    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                name: 'Test User',
                password: 'Password123!',
            };
            const expectedUser = {
                id: 'user-id',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                passwordHash: 'hashed_password',
                role: 'CLIENT',
                active: false,
                emailVerified: false,
                suiteNumber: 'TEST001',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setup_1.prismaMock.user.create.mockResolvedValue(expectedUser);
            const result = await userService.createUser(userData);
            expect(setup_1.prismaMock.user.create).toHaveBeenCalledWith({
                data: {
                    email: userData.email,
                    name: userData.name,
                    passwordHash: 'hashed_password',
                    role: 'CLIENT',
                },
            });
            expect(result).toEqual({
                id: expectedUser.id,
                email: expectedUser.email,
                firstName: expectedUser.firstName,
                lastName: expectedUser.lastName,
                role: expectedUser.role,
                active: expectedUser.active,
                emailVerified: expectedUser.emailVerified,
                suiteNumber: expectedUser.suiteNumber,
                createdAt: expectedUser.createdAt,
                updatedAt: expectedUser.updatedAt,
            });
        });
        it('should throw an error if user with email already exists', async () => {
            const userData = {
                email: 'existing@example.com',
                name: 'Test User',
                password: 'Password123!',
            };
            setup_1.prismaMock.user.findUnique.mockResolvedValue({
                id: 'existing-user-id',
                email: 'existing@example.com',
                firstName: 'Existing',
                lastName: 'User',
                passwordHash: 'hashed_password',
                role: 'CLIENT',
                active: true,
                emailVerified: true,
                suiteNumber: 'TEST002',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await expect(userService.createUser(userData)).rejects.toThrow(new errorMiddleware_1.AppError('Usuário com este email já existe', 400));
        });
    });
});
//# sourceMappingURL=userService.spec.js.map