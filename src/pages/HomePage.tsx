import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Scissors, Utensils, Car } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const categories = [
  { id: '1', name: 'garagiste', slug: 'garagiste', icon: Car },
  { id: '2', name: 'coiffeur', slug: 'coiffeur', icon: Scissors },
  { id: '3', name: 'restaurant', slug: 'restaurant', icon: Utensils },
  { id: '4', name: 'mecanicien', slug: 'mecanicien', icon: Wrench },
];

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t.home.title}
        </h1>
        <p className="text-xl text-gray-600">
          {t.home.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const categoryName = t.categories[category.name as keyof typeof t.categories];
          
          return (
            <Link
              key={category.id}
              to={`/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <Icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{categoryName}</h3>
                <p className="text-gray-600">
                  {t.common.findBest} {categoryName.toLowerCase()}s
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;