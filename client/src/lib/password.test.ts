import { describe, it, expect } from 'vitest';
import { generateSalt, hashPassword, verifyPassword } from './password';

describe('password', () => {
  it('generates a different random salt each time', () => {
    const first = generateSalt();
    const second = generateSalt();

    expect(first).toMatch(/^[0-9a-f]{32}$/);
    expect(first).not.toBe(second);
  });

  it('produces the same hash for the same password and salt', async () => {
    const salt = generateSalt();

    const first = await hashPassword('hola1234', salt);
    const second = await hashPassword('hola1234', salt);

    expect(first).toMatch(/^[0-9a-f]{64}$/);
    expect(first).toBe(second);
  });

  it('produces different hashes for the same password with different salts', async () => {
    const first = await hashPassword('hola1234', generateSalt());
    const second = await hashPassword('hola1234', generateSalt());

    expect(first).not.toBe(second);
  });

  it('verifies only the correct password', async () => {
    const salt = generateSalt();
    const hash = await hashPassword('hola1234', salt);

    await expect(verifyPassword('hola1234', salt, hash)).resolves.toBe(true);
    await expect(verifyPassword('hola12345', salt, hash)).resolves.toBe(false);
  });
});