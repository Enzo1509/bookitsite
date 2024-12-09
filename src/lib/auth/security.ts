import CryptoJS from 'crypto-js';
import { LOGIN_ATTEMPTS } from './constants';
import type { LoginAttempt } from './types';

const loginAttempts = new Map<string, LoginAttempt>();

export const hashPassword = (password: string): string => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const iterations = 100000;
  const keySize = 512 / 32;

  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize,
    iterations,
    hasher: CryptoJS.algo.SHA512
  });

  return `${salt.toString()}:${iterations}:${hash.toString()}`;
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  try {
    const [storedSalt, iterationsStr, storedHash] = hashedPassword.split(':');
    const iterations = parseInt(iterationsStr, 10);
    const keySize = 512 / 32;

    const computedHash = CryptoJS.PBKDF2(password, storedSalt, {
      keySize,
      iterations,
      hasher: CryptoJS.algo.SHA512
    });

    return computedHash.toString() === storedHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

export const checkLoginAttempts = (email: string): boolean => {
  const now = Date.now();
  const attempts = loginAttempts.get(email);

  if (!attempts) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }

  if (now - attempts.lastAttempt > LOGIN_ATTEMPTS.LOCKOUT_DURATION) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }

  if (attempts.count >= LOGIN_ATTEMPTS.MAX_ATTEMPTS) {
    return false;
  }

  attempts.count += 1;
  attempts.lastAttempt = now;
  loginAttempts.set(email, attempts);
  return true;
};

export const resetLoginAttempts = (email: string): void => {
  loginAttempts.delete(email);
};