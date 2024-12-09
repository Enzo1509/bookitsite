import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useFavoriteStore } from '@/store/favoriteStore';

interface FavoriteButtonProps {
  businessId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ businessId }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { addFavorite, removeFavorite, checkIsFavorite } = useFavoriteStore();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isAuthenticated && user) {
        const status = await checkIsFavorite(user.id, businessId);
        setIsFavorite(status);
      }
    };
    checkFavoriteStatus();
  }, [isAuthenticated, user, businessId, checkIsFavorite]);

  const toggleFavorite = async () => {
    if (!isAuthenticated || !user) return;

    try {
      if (isFavorite) {
        await removeFavorite(user.id, businessId);
      } else {
        await addFavorite(user.id, businessId);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-colors ${
        isFavorite
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-gray-500'
      }`}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
};

export default FavoriteButton;