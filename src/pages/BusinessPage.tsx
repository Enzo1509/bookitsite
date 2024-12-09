import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import ReviewList from '@/components/reviews/ReviewList';
import ServiceList from '@/components/services/ServiceList';
import FavoriteButton from '@/components/FavoriteButton';
import { useBusinessStore } from '@/store/businessStore';
import { useTranslation } from '@/hooks/useTranslation';

const BusinessPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [showReviews, setShowReviews] = useState(false);
  const businesses = useBusinessStore(state => state.businesses);
  const { t } = useTranslation();
  
  // Find the corresponding business
  const business = businesses.find(b => b.id === businessId);

  // If the business doesn't exist, redirect to home page
  if (!business) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{business.name}</h1>
          <FavoriteButton businessId={business.id} />
        </div>
        
        <ReviewList
          reviews={business.reviews}
          totalReviews={business.totalReviews}
          rating={business.rating}
          showReviews={showReviews}
          onToggleReviews={() => setShowReviews(!showReviews)}
        />

        <div className="flex items-center text-gray-600 mb-6">
          <MapPin className="h-5 w-5 mr-2" />
          <span>{business.address}, {business.city}</span>
        </div>

        <h2 className="text-xl font-semibold mb-4">{t.business.services}</h2>
        <ServiceList 
          services={business.services} 
          businessId={business.id}
        />
      </div>
    </div>
  );
};

export default BusinessPage;