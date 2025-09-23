import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
export declare const validateRequest: (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
