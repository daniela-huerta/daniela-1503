import { createContext } from 'react';
import type { LoginInput, PublicUser, RegisterInput } from './types';

export interface AuthContextValue {
  user: PublicUser | null;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);