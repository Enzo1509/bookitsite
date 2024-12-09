import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import { useBusinessStore } from '@/store/businessStore';
import type { Business, BusinessCategory } from '@/types/business';
import { businessSchema, type BusinessFormData } from '@/lib/business/validation';
import { createBusiness, updateExistingBusiness } from '@/lib/business/mutations';

const categories: BusinessCategory[] = [
  { id: '1', name: 'Garagiste', slug: 'garagiste', icon: 'car' },
  { id: '2', name: 'Coiffeur', slug: 'coiffeur', icon: 'scissors' },
  { id: '3', name: 'Restaurant', slug: 'restaurant', icon: 'utensils' },
];

const AdminBusinessEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();
  const isNewBusiness = businessId === 'new';
  const businesses = useBusinessStore(state => state.businesses);
  const currentBusiness = businessId ? businesses.find(b => b.id === businessId) : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      categoryId: categories[0].id,
      address: '',
      city: '',
    },
  });

  useEffect(() => {
    if (currentBusiness) {
      reset({
        name: currentBusiness.name,
        categoryId: currentBusiness.category.id,
        address: currentBusiness.address,
        city: currentBusiness.city,
      });
    }
  }, [currentBusiness, reset]);

  const onSubmit = async (data: BusinessFormData) => {
    try {
      const category = categories.find(c => c.id === data.categoryId);
      if (!category) throw new Error('Invalid category');

      const businessData = {
        name: data.name,
        category,
        address: data.address,
        city: data.city,
      };

      if (isNewBusiness) {
        await createBusiness(businessData);
      } else if (businessId) {
        await updateExistingBusiness(businessId, businessData);
      }
      
      navigate('/admin/businesses');
    } catch (error) {
      console.error('Failed to save business:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">
        {isNewBusiness ? 'Nouvelle entreprise' : 'Modifier l\'entreprise'}
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <select
              {...register('categoryId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <input
              type="text"
              {...register('address')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ville
            </label>
            <input
              type="text"
              {...register('city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/businesses')}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBusinessEditPage;