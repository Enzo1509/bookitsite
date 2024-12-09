import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <Calendar className="h-6 w-6 text-blue-600" />
      <span className="text-xl font-bold">Book.it</span>
    </Link>
  );
};

export default Logo;