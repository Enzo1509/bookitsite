export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  role?: 'admin' | 'professional' | 'user';
  businessId?: string;
  password?: string;
  isActive: boolean;
}