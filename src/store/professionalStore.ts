import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useBusinessStore } from './businessStore';
import { hashPassword } from '@/lib/auth';

interface Professional {
  id: string;
  name: string;
  email: string;
  password: string;
  businessId?: string;
  isActive: boolean;
}

interface ProfessionalState {
  professionals: Professional[];
  addProfessional: (professional: Omit<Professional, 'id' | 'password'> & { password: string }) => Promise<void>;
  updateProfessional: (id: string, professional: Partial<Professional>) => Promise<void>;
  deleteProfessional: (id: string) => Promise<void>;
  getProfessionalWithBusiness: (professional: Professional) => {
    id: string;
    name: string;
    email: string;
    businessId?: string;
    businessName?: string;
    isActive: boolean;
  };
  validateCredentials: (email: string, password: string) => Promise<Professional | null>;
}

export const useProfessionalStore = create<ProfessionalState>()(
  persist(
    (set, get) => ({
      professionals: [],
      
      addProfessional: async (professional) => {
        const hashedPassword = hashPassword(professional.password);
        set((state) => ({
          professionals: [
            ...state.professionals,
            {
              ...professional,
              id: crypto.randomUUID(),
              password: hashedPassword,
            },
          ],
        }));
      },
      
      updateProfessional: async (id, professional) => {
        set((state) => ({
          professionals: state.professionals.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...professional,
                  password: professional.password
                    ? hashPassword(professional.password)
                    : p.password,
                }
              : p
          ),
        }));
      },
      
      deleteProfessional: async (id) => {
        set((state) => ({
          professionals: state.professionals.filter((p) => p.id !== id),
        }));
      },

      getProfessionalWithBusiness: (professional) => {
        const businesses = useBusinessStore.getState().businesses;
        const business = businesses.find(b => b.id === professional.businessId);
        return {
          ...professional,
          businessName: business?.name,
        };
      },

      validateCredentials: async (email: string, password: string) => {
        const professional = get().professionals.find(
          p => p.email === email && p.isActive
        );

        if (!professional) return null;

        const hashedPassword = hashPassword(password);
        if (professional.password !== hashedPassword) return null;

        return professional;
      },
    }),
    {
      name: 'professionals-storage',
    }
  )
);