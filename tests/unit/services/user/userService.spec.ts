// tests/unit/services/user/userService.spec.ts
import { prismaMock } from '../../../setup';
import { UserService } from '../../../../src/services/user/userService';
import { AppError } from '../../../../src/middlewares/errorMiddleware';

// Mock do serviço de hash para testes
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(prismaMock);
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
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

      // @ts-expect-error - Ignoramos o erro de tipo aqui porque o jest.fn() já está mockado
      prismaMock.user.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(prismaMock.user.create).toHaveBeenCalledWith({
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
      // Arrange
      const userData = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'Password123!',
      };

      // @ts-expect-error - Ignoramos o erro de tipo aqui porque o jest.fn() já está mockado
      prismaMock.user.findUnique.mockResolvedValue({
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

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow(
        new AppError('Usuário com este email já existe', 400),
      );
    });
  });
});
