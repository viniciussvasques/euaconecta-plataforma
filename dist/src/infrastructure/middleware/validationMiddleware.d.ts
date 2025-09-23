import { Request, Response, NextFunction } from 'express';
export declare const validate: (validationSchema: any) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default validate;
