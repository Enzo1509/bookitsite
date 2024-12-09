import React from 'react';
import { useParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BusinessCard from '../components/BusinessCard';
import { MapPin } from 'lucide-react';
import { useBusinessStore } from '../store/businessStore';

// Mock data - In a real app, this would come from an API
const mockBusinesses = [
  {
    id: '1',
    name: 'Garage Premium Auto',
    category: { id: '1', name: 'Garagiste', slug: 'garagiste', icon: 'car' },
    address: '123 rue de la Réparation',
    city: 'Paris',
    rating: 4.8,
    totalReviews: 127,
    reviews: [],
    services: [
      { id: '1', name: 'Révision complète', duration: 120, price: 149.99, description: 'Révision complète du véhicule' },
      { id: '2', name: 'Vidange', duration: 60, price: 79.99, description: 'Vidange moteur et filtres' }
    ]
  },
  // Add more mock businesses here
];

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const selectedCity = useBusinessStore(state => state.selectedCity);

  const filteredBusinesses = selectedCity
    ? mockBusinesses.filter(b => b.city.toLowerCase().includes(selectedCity.toLowerCase()))
    : mockBusinesses;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Trouvez un professionnel près de chez vous
        </h1>
        <SearchBar />
      </div>

      {selectedCity && (
        <div className="flex items-center mb-6">
          <MapPin className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-lg">Résultats pour : <span className="font-semibold">{selectedCity}</span></span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map(business => (
          <BusinessCard
            key={business.id}
            business={business}
            categorySlug={category || ''}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;