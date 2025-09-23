// tests/mocks/prisma.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Cria um mock profundo do Prisma Client
export type MockPrisma = DeepMockProxy<PrismaClient>;

// Mock do Prisma Client que pode ser usado em testes
export const createMockPrismaClient = () => mockDeep<PrismaClient>();
