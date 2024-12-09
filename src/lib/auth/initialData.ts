import type { User } from '@/types/auth';
import { hashPassword } from './security';
import { DEFAULT_ADMIN, DEFAULT_PROFESSIONAL } from './constants';

export const initialUsers: User[] = [
  {
    id: 'admin',
    email: DEFAULT_ADMIN.email,
    name: 'Administrator',
    role: 'admin',
    password: hashPassword(DEFAULT_ADMIN.password),
  },
  {
    id: 'pro1',
    email: DEFAULT_PROFESSIONAL.email,
    name: 'Professional User',
    role: 'professional',
    businessId: '1',
    password: hashPassword(DEFAULT_PROFESSIONAL.password),
  },
];