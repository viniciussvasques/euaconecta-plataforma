import { PrismaClient } from '@prisma/client';
interface IContext {
    prisma: PrismaClient;
    user?: {
        id: string;
        role: string;
    };
}
export declare const userResolver: {
    Query: {
        users: (_: any, __: any, { prisma, user }: IContext) => Promise<{
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            activationToken: string | null;
            activationTokenExpires: Date | null;
            canManageCarriers: boolean;
            canManageConsolidations: boolean;
            canManagePackages: boolean;
            canManageSettings: boolean;
            canManageUsers: boolean;
            canViewFinancials: boolean;
            cpf: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            permissions: string[];
            suiteNumber: number | null;
        }[]>;
        user: (_: any, { id }: {
            id: string;
        }, { prisma, user }: IContext) => Promise<{
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            activationToken: string | null;
            activationTokenExpires: Date | null;
            canManageCarriers: boolean;
            canManageConsolidations: boolean;
            canManagePackages: boolean;
            canManageSettings: boolean;
            canManageUsers: boolean;
            canViewFinancials: boolean;
            cpf: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            permissions: string[];
            suiteNumber: number | null;
        }>;
    };
    Mutation: {
        createUser: (_: any, { input }: any, { prisma }: IContext) => Promise<{
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            activationToken: string | null;
            activationTokenExpires: Date | null;
            canManageCarriers: boolean;
            canManageConsolidations: boolean;
            canManagePackages: boolean;
            canManageSettings: boolean;
            canManageUsers: boolean;
            canViewFinancials: boolean;
            cpf: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            permissions: string[];
            suiteNumber: number | null;
        }>;
        updateUser: (_: any, { id, input }: any, { prisma, user }: IContext) => Promise<{
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            activationToken: string | null;
            activationTokenExpires: Date | null;
            canManageCarriers: boolean;
            canManageConsolidations: boolean;
            canManagePackages: boolean;
            canManageSettings: boolean;
            canManageUsers: boolean;
            canViewFinancials: boolean;
            cpf: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            permissions: string[];
            suiteNumber: number | null;
        }>;
        deleteUser: (_: any, { id }: {
            id: string;
        }, { prisma, user }: IContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export {};
