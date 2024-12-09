import React from 'react';
import { MapPin } from 'lucide-react';
import { useBusinessStore } from '@/store/businessStore';
import { useTranslation } from '@/hooks/useTranslation';

const SearchBar: React.FC = () => {
  const setSelectedCity = useBusinessStore(state => state.setSelectedCity);
  const { t } = useTranslation();

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="flex items-center bg-white rounded-full shadow-md">
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t.business.citySearchPlaceholder}
            className="w-full pl-12 pr-4 py-3 rounded-l-full border-0 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSelectedCity(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;