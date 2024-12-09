export type BusinessCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};

export type Business = {
  id: string;
  name: string;
  category: BusinessCategory;
  address: string;
  city: string;
  rating: number;
  totalReviews: number;
  reviews: Review[];
  services: Service[];
  googleMapsUrl?: string; // Ajout du champ googleMapsUrl
};

export type Review = {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
};

export type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
};