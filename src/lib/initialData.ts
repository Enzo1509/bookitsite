import type { Business, BusinessCategory } from '@/types/business';

export const categories: BusinessCategory[] = [
  { id: '1', name: 'garagiste', slug: 'garagiste', icon: 'car' },
  { id: '2', name: 'coiffeur', slug: 'coiffeur', icon: 'scissors' },
  { id: '3', name: 'restaurant', slug: 'restaurant', icon: 'utensils' },
  { id: '4', name: 'mecanicien', slug: 'mecanicien', icon: 'wrench' },
];

export const initialBusinesses: Business[] = [
  {
    id: '1',
    name: 'Garage Premium Auto',
    category: categories[0],
    address: '123 rue de la Réparation',
    city: 'Paris',
    rating: 4.8,
    totalReviews: 127,
    reviews: [
      {
        id: '1',
        rating: 5,
        comment: 'Excellent service, très professionnel',
        author: 'Jean Dupont',
        date: '2024-03-01',
      }
    ],
    services: [
      {
        id: '1',
        name: 'Révision complète',
        duration: 120,
        price: 149.99,
        description: 'Révision complète du véhicule',
      },
      {
        id: '2',
        name: 'Vidange',
        duration: 60,
        price: 79.99,
        description: 'Vidange moteur et filtres',
      }
    ],
  },
  {
    id: '2',
    name: 'Salon Élégance',
    category: categories[1],
    address: '45 avenue des Coiffeurs',
    city: 'Lyon',
    rating: 4.9,
    totalReviews: 89,
    reviews: [
      {
        id: '2',
        rating: 5,
        comment: 'Superbe coupe, je recommande !',
        author: 'Marie Martin',
        date: '2024-03-02',
      }
    ],
    services: [
      {
        id: '3',
        name: 'Coupe Homme',
        duration: 30,
        price: 25,
        description: 'Coupe, shampoing et coiffage',
      },
      {
        id: '4',
        name: 'Coupe Femme',
        duration: 60,
        price: 45,
        description: 'Coupe, shampoing et brushing',
      }
    ],
  },
];