// tests/setup.ts
import { PrismaClient } from '@prisma/client';
import { jest } from '@jest/globals';

// Mock do Prisma Client para testes
jest.mock('@prisma/client', () => {
  const mPrisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    // Adicione outros modelos do seu schema aqui
  };
  return {
    PrismaClient: jest.fn(() => mPrisma),
  };
});

// Export do mock para uso nos testes
export const prismaMock = new PrismaClient();
