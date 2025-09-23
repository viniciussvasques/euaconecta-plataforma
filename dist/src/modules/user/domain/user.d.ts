export interface IUser {
    id: string;
    email: string;
    name: string;
    password: string;
    role: UserRole;
    preferredLanguage?: 'pt' | 'en' | 'es';
    createdAt: Date;
    updatedAt: Date;
}
export declare enum UserRole {
    ADMIN = "ADMIN",
    CLIENT = "CLIENT"
}
export interface ICreateUserDto {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
    preferredLanguage?: 'pt' | 'en' | 'es';
}
export interface ILoginDto {
    email: string;
    password: string;
}
export interface IAuthResult {
    user: Omit<IUser, 'password'>;
    token: string;
}
export interface IUpdateUserDto {
    name?: string;
    email?: string;
    preferredLanguage?: 'pt' | 'en' | 'es';
}
export interface IChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
