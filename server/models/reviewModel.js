const { sql } = require("../dbConnection");

// Patikrinti ar vartotojas jau paliko atsiliepimą
exports.findExistingReview = async (userId, tourId) => {
  const result = await sql`
    SELECT * FROM reviews
    WHERE user_id = ${userId} AND tour_id = ${tourId}
  `;
  return result[0]; // jei rado, grąžina review objektą
};

// Atnaujinti tūro vidutinį reitingą
const updateTourRating = async (tourId) => {
  await sql`
    UPDATE tours
    SET rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE tour_id = ${tourId}
    )
    WHERE id = ${tourId};
  `;
};

// Sukurti naują atsiliepimą ir atnaujinti tūro reitingą
exports.createReviewModel = async (userId, tourId, rating, comment) => {
  const result = await sql`
    INSERT INTO reviews (user_id, tour_id, rating, comment)
    VALUES (${userId}, ${tourId}, ${rating}, ${comment})
    RETURNING *;
  `;

  // Po įterpimo atnaujinam tūro vidutinį reitingą
  await updateTourRating(tourId);

  return result[0];
};

exports.getUserReviews = async (userId) => {
  const result = await sql`
    SELECT reviews.*, tours.title, tours.image
    FROM reviews
    LEFT JOIN tours ON reviews.tour_id = tours.id
    WHERE reviews.user_id = ${userId}
  `;
  return result;
};


// Gauti visus atsiliepimus konkrečiam turui
exports.getReviewsByTourIdModel = async (tourId) => {
  const result = await sql`
    SELECT 
      reviews.*, 
      users.name AS user_name 
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    WHERE reviews.tour_id = ${tourId}
    ORDER BY reviews.created_at DESC;
  `;
  return result;
};
