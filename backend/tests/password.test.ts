import { describe, expect, it } from 'vitest';

import { comparePassword, hashPassword } from '../src/utils/password.js';

describe('Password utilities', () => {
  it('should hash a password and verify the correct password', async () => {
    const password = 'TestPassword123!';

    const hashedPassword = await hashPassword(password);

    expect(hashedPassword).not.toBe(password);
    expect(await comparePassword(password, hashedPassword)).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const password = 'TestPassword123!';
    const wrongPassword = 'WrongPassword123!';

    const hashedPassword = await hashPassword(password);

    expect(await comparePassword(wrongPassword, hashedPassword)).toBe(false);
  });
});