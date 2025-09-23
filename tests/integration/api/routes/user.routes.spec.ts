// tests/integration/api/routes/user.routes.spec.ts
import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createUserRouter } from '../../../../src/api/routes/userRoutes';
import { authMiddleware } from '../../../../src/middlewares/authMiddleware';

// Mock do middleware de autenticação
jest.mock('../../../../src/middlewares/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

// Mock do Prisma Client
const mockPrisma = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as PrismaClient;

describe('User Routes Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', createUserRouter(mockPrisma));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return a list of users', async () => {
      // Arrange
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

      // @ts-expect-error - Ignoramos o erro de tipo aqui porque o jest.fn() já está mockado
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      // Act
      const response = await request(app).get('/api/users');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body.users).toHaveLength(2);
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(authMiddleware).toHaveBeenCalled();
    });

    it('should handle errors and return 500 status', async () => {
      // Arrange
      // @ts-expect-error - Ignoramos o erro de tipo aqui porque o jest.fn() já está mockado
      mockPrisma.user.findMany.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app).get('/api/users');

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      // Arrange
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

      // @ts-expect-error - Ignoramos o erro de tipo aqui porque o jest.fn() já está mockado
      mockPrisma.user.create.mockResolvedValue(createdUser);
      // @ts-expect-error - Ignoramos o erro de tipo aqui porque o jest.fn() já está mockado
      mockPrisma.user.findUnique.mockResolvedValue(null); // Email não existe

      // Act
      const response = await request(app).post('/api/users').send(newUser);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', 'new-user-id');
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockPrisma.user.findUnique).toHaveBeenCalled();
    });
  });
});
