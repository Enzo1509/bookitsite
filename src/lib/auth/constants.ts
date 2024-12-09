export const DEFAULT_CREDENTIALS = {
  ADMIN: {
    email: 'admin@book.it',
    password: 'admin123',
  },
  PROFESSIONAL: {
    email: 'pro@book.it',
    password: 'pro123',
  },
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_EXISTS: 'Email already exists',
  INACTIVE_ACCOUNT: 'Account is inactive',
  USER_NOT_FOUND: 'User not found',
  INCORRECT_PASSWORD: 'Current password is incorrect',
} as const;