import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import Button from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { passwordSchema } from '@/lib/auth';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'professional', 'user']),
  businessId: z.string().optional(),
  newPassword: z.string().optional(),
});

type UserForm = z.infer<typeof userSchema>;

const AdminUserEditPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { users, updateUser } = useAuthStore();
  const { businesses } = useBusinessStore();
  const { t } = useTranslation();
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const currentUser = users.find(user => user.id === userId);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: currentUser ? {
      name: currentUser.name || '',
      email: currentUser.email,
      role: currentUser.role || 'user',
      businessId: currentUser.businessId,
      newPassword: '',
    } : undefined,
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: UserForm) => {
    try {
      if (!userId) return;

      // Validate password if provided
      if (data.newPassword) {
        try {
          await passwordSchema.parseAsync(data.newPassword);
        } catch (error) {
          if (error instanceof z.ZodError) {
            setError('newPassword', { message: error.errors[0].message });
            return;
          }
        }
      }

      // Only include businessId if role is professional
      const updateData = {
        ...data,
        businessId: data.role === 'professional' ? data.businessId : undefined,
      };

      await updateUser(userId, updateData);
      navigate('/admin/users');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{t.admin.users.edit}</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.admin.users.name}
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
              {t.admin.users.type}
            </label>
            <select
              {...register('role')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="user">{t.admin.users.client}</option>
              <option value="professional">{t.admin.users.professional}</option>
              <option value="admin">{t.admin.users.admin}</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {selectedRole === 'professional' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t.admin.businesses.title}
              </label>
              <select
                {...register('businessId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">{t.admin.users.selectBusiness}</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name} - {business.city}
                  </option>
                ))}
              </select>
              {errors.businessId && (
                <p className="mt-1 text-sm text-red-600">{errors.businessId.message}</p>
              )}
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showPasswordChange ? 'Cancel password change' : 'Change password'}
            </button>

            {showPasswordChange && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  {...register('newPassword')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/users')}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t.common.saving : t.common.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserEditPage;