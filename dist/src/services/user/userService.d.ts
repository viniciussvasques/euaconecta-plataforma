import { PrismaClient, User, UserRole } from '@prisma/client';
interface ICreateUserDto {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
}
interface IUpdateUserDto {
    name?: string;
    password?: string;
    isActive?: boolean;
    role?: UserRole;
}
type UserResponse = Omit<User, 'password'>;
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaClient);
    createUser(userData: ICreateUserDto): Promise<UserResponse>;
    findAllUsers(): Promise<UserResponse[]>;
    findUserById(id: string): Promise<UserResponse>;
    updateUser(id: string, userData: IUpdateUserDto): Promise<UserResponse>;
    deleteUser(id: string): Promise<void>;
    findUserByEmail(email: string): Promise<User | null>;
    validateCredentials(email: string, password: string): Promise<UserResponse>;
}
export {};
