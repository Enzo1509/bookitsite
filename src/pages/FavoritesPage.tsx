import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import BusinessCard from '@/components/BusinessCard';
import { useTranslation } from '@/hooks/useTranslation';

const FavoritesPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { favorites, loadFavorites } = useFavoriteStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites(user.id);
    }
  }, [isAuthenticated, user, loadFavorites]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t.favorites.title}</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t.favorites.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(business => (
            <BusinessCard
              key={business.id}
              business={business}
              categorySlug={business.category.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;