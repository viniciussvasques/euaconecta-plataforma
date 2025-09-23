import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
export declare class AuthService {
    private readonly authRepository;
    constructor(authRepository: AuthRepository);
    signup(dto: SignupDto, req: any): Promise<{
        user: {
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
        };
        message: any;
    }>;
    login(dto: LoginDto, req: any): Promise<{
        user: {
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
        };
        accessToken: string;
        refreshToken: string;
        message: any;
    }>;
    refresh(refreshToken: string, req: any): Promise<{
        accessToken: string;
        refreshToken: string;
        message: any;
    }>;
    logout(refreshToken: string, req: any): Promise<{
        message: any;
    }>;
    forgotPassword(dto: ForgotPasswordDto, req: any): Promise<{
        message: any;
    }>;
    resetPassword(dto: ResetPasswordDto, req: any): Promise<{
        message: any;
    }>;
    resendVerification(dto: ResendVerificationDto, req: any): Promise<{
        message: any;
    }>;
}
