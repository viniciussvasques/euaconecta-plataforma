import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
export declare function configureApiRoutes(prisma: PrismaClient): Router;
