import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Business } from '../types/business';
import * as db from '../lib/db';

interface BusinessState {
  businesses: Business[];
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  loadBusinesses: () => Promise<void>;
  updateBusiness: (id: string, business: Business) => Promise<Business>;
  deleteBusiness: (id: string) => Promise<void>;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      businesses: [],
      selectedCity: null,
      setSelectedCity: (city) => set({ selectedCity: city }),
      
      loadBusinesses: async () => {
        try {
          const businesses = await db.getAllBusinesses();
          set({ businesses });
        } catch (error) {
          console.error('Failed to load businesses:', error);
          throw error;
        }
      },
      
      updateBusiness: async (id, business) => {
        try {
          const updatedBusiness = await db.updateBusiness(id, business);
          set(state => ({
            businesses: state.businesses.map(b =>
              b.id === id ? updatedBusiness : b
            ),
          }));
          return updatedBusiness;
        } catch (error) {
          console.error('Failed to update business:', error);
          throw error;
        }
      },

      deleteBusiness: async (id) => {
        try {
          await db.deleteBusiness(id);
          set(state => ({
            businesses: state.businesses.filter(b => b.id !== id),
          }));
        } catch (error) {
          console.error('Failed to delete business:', error);
          throw error;
        }
      },
    }),
    {
      name: 'business-storage',
    }
  )
);