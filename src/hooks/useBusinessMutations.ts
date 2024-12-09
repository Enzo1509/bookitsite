import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useBusinessStore } from '@/store/businessStore';
import type { Business } from '@/types/business';

export function useBusinessMutations() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addBusiness, updateBusiness } = useBusinessStore();

  const createBusiness = useMutation({
    mutationFn: async (business: Omit<Business, 'id' | 'rating' | 'totalReviews' | 'reviews' | 'services'>) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newBusiness = {
        ...business,
        id: Math.random().toString(36).substr(2, 9),
        rating: 0,
        totalReviews: 0,
        reviews: [],
        services: [],
      };
      addBusiness(newBusiness);
      return newBusiness;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] });
      navigate('/admin/businesses');
    },
  });

  const editBusiness = useMutation({
    mutationFn: async (business: Business) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateBusiness(business.id, business);
      return business;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] });
      navigate('/admin/businesses');
    },
  });

  return {
    createBusiness,
    editBusiness,
  };
}