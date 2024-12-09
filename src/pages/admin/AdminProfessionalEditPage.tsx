import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import { useProfessionalStore } from '@/store/professionalStore';
import { useBusinessStore } from '@/store/businessStore';

const professionalSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  businessId: z.string().optional(),
  isActive: z.boolean(),
});

type ProfessionalForm = z.infer<typeof professionalSchema>;

const AdminProfessionalEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { professionalId } = useParams<{ professionalId: string }>();
  const isNewProfessional = professionalId === 'new';
  const { professionals, addProfessional, updateProfessional } = useProfessionalStore();
  const businesses = useBusinessStore(state => state.businesses);
  const currentProfessional = professionalId ? professionals.find(p => p.id === professionalId) : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalForm>({
    resolver: zodResolver(professionalSchema),
    defaultValues: currentProfessional || {
      name: '',
      email: '',
      password: '',
      isActive: true,
    },
  });

  const onSubmit = async (data: ProfessionalForm) => {
    try {
      if (isNewProfessional) {
        await addProfessional(data);
      } else if (professionalId) {
        await updateProfessional(professionalId, data);
      }
      navigate('/admin/professionals');
    } catch (error) {
      console.error('Failed to save professional:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">
        {isNewProfessional ? 'Nouveau compte professionnel' : 'Modifier le compte'}
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom complet
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
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Entreprise
            </label>
            <select
              {...register('businessId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sélectionner une entreprise</option>
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isActive')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Compte actif
            </label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfessionalEditPage;