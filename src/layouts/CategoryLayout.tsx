import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useBusinessStore } from '@/store/businessStore';
import SearchBar from '@/components/SearchBar';
import { useTranslation } from '@/hooks/useTranslation';

const CategoryLayout: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const selectedCity = useBusinessStore(state => state.selectedCity);
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t.business.findIn} {t.categories[category as keyof typeof t.categories]} {t.business.near}
        </h1>
        <SearchBar />
      </div>
      <Outlet />
    </div>
  );
};

export default CategoryLayout;