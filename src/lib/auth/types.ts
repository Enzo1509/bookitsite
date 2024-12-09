export interface LoginAttempt {
  count: number;
  lastAttempt: number;
}

export interface AuthErrors {
  INVALID_CREDENTIALS: string;
  EMAIL_EXISTS: string;
  TOO_MANY_ATTEMPTS: string;
  APPLE_NOT_IMPLEMENTED: string;
}

export interface LoginConfig {
  MAX_ATTEMPTS: number;
  LOCKOUT_DURATION: number;
}

export interface DefaultCredentials {
  email: string;
  password: string;
}