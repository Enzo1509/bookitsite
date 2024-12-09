import { create } from 'zustand';
import type { User } from '@/types/auth';
import { initialUsers } from '@/lib/auth';
import { DEFAULT_CREDENTIALS, AUTH_ERRORS } from '@/lib/auth/constants';
import { saveToStorage, loadFromStorage, clearStorage } from '@/lib/auth/storage';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  users: User[];
  loadUsers: () => void;
  login: (email: string, password: string, role?: 'admin' | 'professional' | 'user') => void;
  register: (email: string, password: string, name?: string) => void;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (userId: string, updates: Partial<User> & { currentPassword?: string }) => void;
  deleteUser: (userId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Load initial state from storage
  const storedData = loadFromStorage();
  
  return {
    isAuthenticated: !!storedData?.currentUser,
    user: storedData?.currentUser || null,
    users: storedData?.users || initialUsers,

    loadUsers: () => {
      const state = get();
      if (state.users.length === 0) {
        set({ users: initialUsers });
        saveToStorage({ users: initialUsers, currentUser: null });
      }
    },

    login: (email, password, role) => {
      // Special handling for default credentials
      if (email === DEFAULT_CREDENTIALS.ADMIN.email && 
          password === DEFAULT_CREDENTIALS.ADMIN.password) {
        const adminUser = get().users.find(u => u.role === 'admin');
        if (adminUser) {
          set({ isAuthenticated: true, user: adminUser });
          saveToStorage({ users: get().users, currentUser: adminUser });
          return;
        }
      }

      if (email === DEFAULT_CREDENTIALS.PROFESSIONAL.email && 
          password === DEFAULT_CREDENTIALS.PROFESSIONAL.password) {
        const proUser = get().users.find(u => u.role === 'professional');
        if (proUser) {
          set({ isAuthenticated: true, user: proUser });
          saveToStorage({ users: get().users, currentUser: proUser });
          return;
        }
      }

      // Regular user login
      const user = get().users.find(u => u.email === email);
      
      if (!user) {
        throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
      }

      if (role && user.role !== role) {
        throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
      }

      if (!user.isActive) {
        throw new Error(AUTH_ERRORS.INACTIVE_ACCOUNT);
      }

      if (user.password !== password) {
        throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
      }

      const { password: _, ...userWithoutPassword } = user;
      set({ isAuthenticated: true, user: userWithoutPassword });
      saveToStorage({ users: get().users, currentUser: userWithoutPassword });
    },

    register: (email, password, name) => {
      const existingUser = get().users.find(u => u.email === email);
      if (existingUser) {
        throw new Error(AUTH_ERRORS.EMAIL_EXISTS);
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        password,
        role: 'user',
        isActive: true,
      };
      
      const { password: _, ...userWithoutPassword } = newUser;
      set(state => {
        const newUsers = [...state.users, newUser];
        saveToStorage({ users: newUsers, currentUser: userWithoutPassword });
        return {
          users: newUsers,
          isAuthenticated: true,
          user: userWithoutPassword,
        };
      });
    },

    logout: () => {
      set({ isAuthenticated: false, user: null });
      clearStorage();
    },

    addUser: (userData) => {
      const newUser: User = {
        ...userData,
        id: crypto.randomUUID(),
        isActive: true,
      };

      set(state => {
        const newUsers = [...state.users, newUser];
        saveToStorage({ users: newUsers, currentUser: state.user });
        return { users: newUsers };
      });

      return newUser;
    },

    updateUser: (userId, updates) => {
      const state = get();
      const user = state.users.find(u => u.id === userId);

      if (!user) {
        throw new Error(AUTH_ERRORS.USER_NOT_FOUND);
      }

      if (updates.currentPassword && user.password) {
        if (updates.currentPassword !== user.password) {
          throw new Error(AUTH_ERRORS.INCORRECT_PASSWORD);
        }
      }

      const updatedData = { ...updates };
      delete updatedData.currentPassword;

      const updatedUsers = state.users.map(u => 
        u.id === userId ? { ...u, ...updatedData } : u
      );

      const updatedCurrentUser = state.user?.id === userId ? 
        { ...state.user, ...updatedData } : 
        state.user;

      set({
        users: updatedUsers,
        user: updatedCurrentUser,
      });

      saveToStorage({ users: updatedUsers, currentUser: updatedCurrentUser });
    },

    deleteUser: (userId) => {
      const state = get();
      const newUsers = state.users.filter(user => user.id !== userId);
      const newCurrentUser = state.user?.id === userId ? null : state.user;
      
      set({
        users: newUsers,
        ...(state.user?.id === userId ? {
          isAuthenticated: false,
          user: null,
        } : {}),
      });

      saveToStorage({ users: newUsers, currentUser: newCurrentUser });
    },
  };
});