export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  salt: string;
  balance: number;
  createdAt: string;
}

export type PublicUser = Omit<StoredUser, 'passwordHash' | 'salt'>;

export interface Session {
  userId: string;
  createdAt: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export type AuthErrorCode = 'EMAIL_TAKEN' | 'INVALID_CREDENTIALS';

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}