import { generateSalt, hashPassword, verifyPassword } from '../../lib/password';
import { readJSON, writeJSON, removeItem, STORAGE_KEYS } from '../../lib/storage';
import {
  AuthError,
  type LoginInput,
  type PublicUser,
  type RegisterInput,
  type Session,
  type StoredUser,
} from './types';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getUsers(): StoredUser[] {
  return readJSON<StoredUser[]>(STORAGE_KEYS.users, []);
}

function saveUsers(users: StoredUser[]): void {
  writeJSON(STORAGE_KEYS.users, users);
}

function startSession(userId: string): void {
  const session: Session = { userId, createdAt: new Date().toISOString() };
  writeJSON(STORAGE_KEYS.session, session);
}

function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    balance: user.balance,
    createdAt: user.createdAt,
  };
}

export async function register(input: RegisterInput): Promise<PublicUser> {
  const email = normalizeEmail(input.email);
  const users = getUsers();

  if (users.some((user) => user.email === email)) {
    throw new AuthError('EMAIL_TAKEN', 'Ya existe una cuenta con este correo.');
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(input.password, salt);

  const user: StoredUser = {
    id: crypto.randomUUID(),
    fullName: input.fullName.trim(),
    email,
    passwordHash,
    salt,
    balance: 0,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, user]);
  startSession(user.id);

  return toPublicUser(user);
}

export async function login(input: LoginInput): Promise<PublicUser> {
  const email = normalizeEmail(input.email);
  const user = getUsers().find((storedUser) => storedUser.email === email);

  const isValid = user
    ? await verifyPassword(input.password, user.salt, user.passwordHash)
    : false;

  if (!user || !isValid) {
    throw new AuthError('INVALID_CREDENTIALS', 'Correo o contraseña incorrectos.');
  }

  startSession(user.id);
  return toPublicUser(user);
}

export function logout(): void {
  removeItem(STORAGE_KEYS.session);
}

export function getCurrentUser(): PublicUser | null {
  const session = readJSON<Session | null>(STORAGE_KEYS.session, null);
  if (!session) return null;

  const user = getUsers().find((storedUser) => storedUser.id === session.userId);

  if (!user) {
    removeItem(STORAGE_KEYS.session);
    return null;
  }

  return toPublicUser(user);
}

export function creditBalance(userId: string, amount: number): PublicUser {
  const users = getUsers();
  const user = users.find((storedUser) => storedUser.id === userId);

  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser: StoredUser = {
    ...user,
    balance: Math.round((user.balance + amount) * 100) / 100,
  };

  saveUsers(users.map((storedUser) => (storedUser.id === userId ? updatedUser : storedUser)));
  return toPublicUser(updatedUser);
}