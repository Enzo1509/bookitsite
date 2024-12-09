import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Business } from '@/types/business';
import { formatPrice } from '@/lib/utils';
import FavoriteButton from './FavoriteButton';
import { useTranslation } from '@/hooks/useTranslation';

interface BusinessCardProps {
  business: Business;
  categorySlug: string;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, categorySlug }) => {
  const { t } = useTranslation();
  const minPrice = business.services.length > 0
    ? Math.min(...business.services.map(s => s.price))
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start">
        <Link
          to={`/${categorySlug}/${business.id}`}
          className="flex-1"
        >
          <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
          <p className="text-gray-600 mb-3">{business.address}, {business.city}</p>
          
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{business.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{business.totalReviews} {t.business.reviews}</span>
          </div>

          <div className="border-t pt-4">
            {minPrice > 0 ? (
              <p className="text-sm text-gray-600">{t.business.from} {formatPrice(minPrice)}</p>
            ) : (
              <p className="text-sm text-gray-600">{t.business.pricesUnavailable}</p>
            )}
          </div>
        </Link>
        
        <FavoriteButton businessId={business.id} />
      </div>
    </div>
  );
};

export default BusinessCard;