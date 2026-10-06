import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import * as authService from './authService';
import type { LoginInput, PublicUser, RegisterInput } from './types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(() => authService.getCurrentUser());

  async function register(input: RegisterInput) {
    const newUser = await authService.register(input);
    setUser(newUser);
  }

  async function login(input: LoginInput) {
    const loggedUser = await authService.login(input);
    setUser(loggedUser);
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  function creditBalance(amount: number) {
    if (!user) return;
    setUser(authService.creditBalance(user.id, amount));
  }

  return (
    <AuthContext value={{ user, register, login, logout, creditBalance }}>
      {children}
    </AuthContext>
  );
}