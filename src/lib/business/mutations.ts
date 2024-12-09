import type { Business } from '@/types/business';
import { useBusinessStore } from '@/store/businessStore';

export async function createBusiness(data: Partial<Business>): Promise<Business> {
  try {
    const newBusiness: Business = {
      id: crypto.randomUUID(),
      name: data.name || '',
      category: data.category!,
      address: data.address || '',
      city: data.city || '',
      rating: 0,
      totalReviews: 0,
      reviews: [],
      services: [],
    };

    const { updateBusiness } = useBusinessStore.getState();
    await updateBusiness(newBusiness.id, newBusiness);
    return newBusiness;
  } catch (error) {
    console.error('Failed to create business:', error);
    throw new Error('Failed to create business');
  }
}

export async function updateExistingBusiness(id: string, data: Partial<Business>): Promise<Business> {
  try {
    const { businesses, updateBusiness } = useBusinessStore.getState();
    const existingBusiness = businesses.find(b => b.id === id);
    
    if (!existingBusiness) {
      throw new Error('Business not found');
    }

    const updatedBusiness = {
      ...existingBusiness,
      ...data,
    };

    await updateBusiness(id, updatedBusiness);
    return updatedBusiness;
  } catch (error) {
    console.error('Failed to update business:', error);
    throw new Error('Failed to update business');
  }
}