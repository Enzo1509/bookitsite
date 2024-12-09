import axios from 'axios';

interface GooglePlaceDetails {
  rating: number;
  user_ratings_total: number;
  reviews: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

export async function getGooglePlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status === 'OK') {
      return {
        rating: response.data.result.rating,
        user_ratings_total: response.data.result.user_ratings_total,
        reviews: response.data.result.reviews,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch Google Place details:', error);
    return null;
  }
}

export function extractPlaceIdFromUrl(googleMapsUrl: string): string | null {
  try {
    const url = new URL(googleMapsUrl);
    const placeId = url.searchParams.get('pid') || url.searchParams.get('place_id');
    return placeId;
  } catch {
    return null;
  }
}