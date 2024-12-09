import { z } from 'zod';
import type { User } from '@/types/auth';

// Simple password validation schema
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

// Error messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_EXISTS: 'Email already exists',
  INACTIVE_ACCOUNT: 'Account is inactive',
} as const;

// Simple password hashing for demo purposes
export function hashPassword(password: string): string {
  return password;
}

// Password verification
export function verifyPassword(password: string, hashedPassword: string): boolean {
  return password === hashedPassword;
}

// Initial users with simple passwords
export const initialUsers: User[] = [
  {
    id: 'admin',
    email: 'admin@book.it',
    name: 'Administrator',
    role: 'admin',
    password: 'admin123',
    isActive: true,
  },
  {
    id: 'pro1',
    email: 'pro@book.it',
    name: 'Professional User',
    role: 'professional',
    businessId: '1',
    password: 'pro123',
    isActive: true,
  },
];