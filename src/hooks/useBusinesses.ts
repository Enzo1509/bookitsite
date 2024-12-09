import { useQuery } from '@tanstack/react-query';
import { useBusinessStore } from '@/store/businessStore';
import type { Business } from '@/types/business';

export function useBusinesses(category: string, city: string) {
  const businesses = useBusinessStore(state => state.businesses);

  return useQuery({
    queryKey: ['businesses', category, city],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return businesses.filter(business => 
        business.category.slug === category &&
        (!city || business.city.toLowerCase().includes(city.toLowerCase()))
      );
    }
  });
}