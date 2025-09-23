/**
 * Interface que representa a entidade de Usuário no domínio da aplicação
 */
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

/**
 * Enum que define os possíveis papéis de usuário no sistema
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

/**
 * Interface que representa as informações necessárias para criar um novo usuário
 */
export interface ICreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
  preferredLanguage?: 'pt' | 'en' | 'es';
}

/**
 * Interface que representa as informações necessárias para autenticação
 */
export interface ILoginDto {
  email: string;
  password: string;
}

/**
 * Interface que representa o resultado de uma autenticação bem-sucedida
 */
export interface IAuthResult {
  user: Omit<IUser, 'password'>;
  token: string;
}

/**
 * Interface que representa as informações necessárias para atualizar um usuário
 */
export interface IUpdateUserDto {
  name?: string;
  email?: string;
  preferredLanguage?: 'pt' | 'en' | 'es';
}

/**
 * Interface que representa as informações necessárias para alterar a senha
 */
export interface IChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
