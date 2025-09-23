import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
export declare class AuthRepository {
    createUser(dto: SignupDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string;
        phone: string | null;
        password: string;
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
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    loginUser(dto: LoginDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string;
        phone: string | null;
        password: string;
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
        role: import(".prisma/client").$Enums.UserRole;
    } | null>;
    findUserById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string;
        phone: string | null;
        password: string;
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
        role: import(".prisma/client").$Enums.UserRole;
    } | null>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        success: boolean;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
    }>;
    resendVerification(dto: ResendVerificationDto): Promise<{
        success: boolean;
    }>;
}
