import { z } from 'zod';
import { DEFAULT_ADMIN, DEFAULT_PROFESSIONAL } from './constants';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const validateAdminCredentials = (email: string, password: string): boolean => {
  return email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password;
};

export const validateProfessionalCredentials = (email: string, password: string): boolean => {
  return email === DEFAULT_PROFESSIONAL.email && password === DEFAULT_PROFESSIONAL.password;
};