import { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from "./StarRating";
const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewsOneTour({ tourId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!tourId) return;

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_URL}/reviews/tours/${tourId}/reviews`, {
          withCredentials: true,
        });
        setReviews(response.data.data);
      } catch (error) {
        console.error("Klaida:", error);
      }
    };

    fetchReviews();
  }, [tourId]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('lt-LT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Atsiliepimai</h2>
      {reviews.length === 0 ? (
        <p className="text-center text-gray-600">Ši procedura dar neturi atsiliepimų.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-gray-800">{review.user_name}</span>
              <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
            </div>
            <div className="text-yellow-600 font-semibold"><StarRating rating={review.rating} /></div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}
