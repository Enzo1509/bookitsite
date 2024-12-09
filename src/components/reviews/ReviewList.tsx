import React from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import type { Review } from '@/types/business';

interface ReviewListProps {
  reviews: Review[];
  totalReviews: number;
  rating: number;
  showReviews: boolean;
  onToggleReviews: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  totalReviews,
  rating,
  showReviews,
  onToggleReviews,
}) => {
  return (
    <>
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center">
          <Star className="h-5 w-5 text-yellow-400 fill-current" />
          <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
        </div>
        <button
          onClick={onToggleReviews}
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          {totalReviews} avis
          {showReviews ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          )}
        </button>
      </div>

      {showReviews && (
        <div className="mb-6 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 font-medium">{review.author}</span>
                <span className="ml-2 text-gray-500 text-sm">{review.date}</span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ReviewList;