import { describe, expect, it } from 'vitest';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../src/utils/jwt.js';

describe('JWT utilities', () => {
  const adminId = 'test-admin-id';

  it('should generate and verify an access token', () => {
    const token = generateAccessToken(adminId);

    const payload = verifyAccessToken(token);

    expect(payload.adminId).toBe(adminId);
  });

  it('should generate and verify a refresh token', () => {
    const token = generateRefreshToken(adminId);

    const payload = verifyRefreshToken(token);

    expect(payload.adminId).toBe(adminId);
  });

  it('should reject an invalid access token', () => {
    expect(() => verifyAccessToken('invalid-token')).toThrow();
  });

  it('should reject an invalid refresh token', () => {
    expect(() => verifyRefreshToken('invalid-token')).toThrow();
  });
});