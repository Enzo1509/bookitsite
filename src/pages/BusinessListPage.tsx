import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useBusinessStore } from '@/store/businessStore';
import BusinessCard from '@/components/BusinessCard';
import { useBusinesses } from '@/hooks/useBusinesses';

const BusinessListPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const selectedCity = useBusinessStore(state => state.selectedCity);
  const { data: businesses, isLoading } = useBusinesses(category || '', selectedCity || '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {selectedCity && (
        <div className="flex items-center mb-6">
          <MapPin className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-lg">
            Résultats pour : <span className="font-semibold">{selectedCity}</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses?.map(business => (
          <BusinessCard
            key={business.id}
            business={business}
            categorySlug={category || ''}
          />
        ))}
      </div>
    </div>
  );
}

export default BusinessListPage;