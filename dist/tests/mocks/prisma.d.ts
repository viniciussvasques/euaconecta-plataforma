import { PrismaClient } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';
export type MockPrisma = DeepMockProxy<PrismaClient>;
export declare const createMockPrismaClient: () => DeepMockProxy<PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>>;
