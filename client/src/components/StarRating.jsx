import { FaStar, FaRegStar } from "react-icons/fa"; 

const StarRating = ({ rating }) => {
  const totalStars = 5;

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[...Array(totalStars)].map((_, index) => {
        return index < rating ? (
          <FaStar key={index} color="#facc15" /> 
        ) : (
          <FaRegStar key={index} color="#facc15" />
        );
      })}
    </div>
  );
};

export default StarRating;
