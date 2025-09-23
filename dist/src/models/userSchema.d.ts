import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        password: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<{
            SUPER_ADMIN: "SUPER_ADMIN";
            ADMIN: "ADMIN";
            OPERATOR: "OPERATOR";
            MANAGER: "MANAGER";
            CLIENT: "CLIENT";
            SUPPORT: "SUPPORT";
        }>>;
    }, z.core.$strip>;
    query: z.ZodObject<{}, z.core.$strip>;
    params: z.ZodObject<{}, z.core.$strip>;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        active: z.ZodOptional<z.ZodBoolean>;
        role: z.ZodOptional<z.ZodEnum<{
            SUPER_ADMIN: "SUPER_ADMIN";
            ADMIN: "ADMIN";
            OPERATOR: "OPERATOR";
            MANAGER: "MANAGER";
            CLIENT: "CLIENT";
            SUPPORT: "SUPPORT";
        }>>;
    }, z.core.$strip>;
    query: z.ZodObject<{}, z.core.$strip>;
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
