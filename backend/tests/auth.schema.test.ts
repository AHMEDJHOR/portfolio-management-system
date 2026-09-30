import { describe, expect, it } from 'vitest';

import {
  loginSchema,
  logoutSchema,
  refreshSchema,
} from '../src/schemas/auth.schema.js';

describe('Auth schemas', () => {
  it('should accept valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'admin@example.com',
      password: 'Password123!',
    });

    expect(result.success).toBe(true);
  });

  it('should reject an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'Password123!',
    });

    expect(result.success).toBe(false);
  });

  it('should reject an empty login password', () => {
    const result = loginSchema.safeParse({
      email: 'admin@example.com',
      password: '',
    });

    expect(result.success).toBe(false);
  });

  it('should accept a valid refresh token', () => {
    const result = refreshSchema.safeParse({
      refreshToken: 'valid-refresh-token',
    });

    expect(result.success).toBe(true);
  });

  it('should reject an empty refresh token', () => {
    const result = refreshSchema.safeParse({
      refreshToken: '',
    });

    expect(result.success).toBe(false);
  });

  it('should reject an empty logout refresh token', () => {
    const result = logoutSchema.safeParse({
      refreshToken: '',
    });

    expect(result.success).toBe(false);
  });
});