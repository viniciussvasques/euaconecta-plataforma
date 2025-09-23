import { Request, Response, NextFunction } from 'express';
export declare function authMiddleware(allowedRoles?: string[]): (req: Request, res: Response, next: NextFunction) => void;
