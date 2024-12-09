import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addToFavorites, removeFromFavorites, getFavorites, isFavorite } from '@/lib/db';
import type { Business } from '@/types/business';

interface FavoriteState {
  favorites: Business[];
  loadFavorites: (userId: string) => Promise<void>;
  addFavorite: (userId: string, businessId: string) => Promise<void>;
  removeFavorite: (userId: string, businessId: string) => Promise<void>;
  checkIsFavorite: (userId: string, businessId: string) => Promise<boolean>;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set) => ({
      favorites: [],
      
      loadFavorites: async (userId: string) => {
        const favorites = await getFavorites(userId);
        set({ favorites });
      },
      
      addFavorite: async (userId: string, businessId: string) => {
        await addToFavorites(userId, businessId);
        const favorites = await getFavorites(userId);
        set({ favorites });
      },
      
      removeFavorite: async (userId: string, businessId: string) => {
        await removeFromFavorites(userId, businessId);
        const favorites = await getFavorites(userId);
        set({ favorites });
      },
      
      checkIsFavorite: async (userId: string, businessId: string) => {
        return isFavorite(userId, businessId);
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);