import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import axios from "axios";
import StarRating from "./StarRating";
const API_URL = import.meta.env.VITE_API_URL;
export default function MyReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_URL}/reviews/myreviews`, {
          withCredentials: true,
        });
        console.log(response);

        setReviews(response.data.data);
      } catch (error) {
        console.error("Klaida:", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <>
      <Navigation />
      <h1 className="text-3xl font-bold mb-4 text-center">Mano atsiliepimai</h1>
      {reviews.length === 0 ? (
        <h2 className=" w-full text-center text-2xl">Nėra atsiliepimų.</h2>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-8">
          {reviews.map((review) => (
            <div key={review.id}>
              <div className="flex justify-between items-center h-14">
                <div className="text-sm">
                  {new Date(review.created_at).toLocaleString("lt-LT")}
                </div>
                <h2 className="text-lg font-semibold">{review.title}</h2>
              </div>

              <div>
                <img
                  className="w-full h-48 object-cover mb-2 rounded-2xl hover:scale-105 transition-all duration-300"
                  src={review.image}
                  alt={review.title}
                />
              </div>
              <p>{review.comment}</p>
              <StarRating rating={review.rating} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
