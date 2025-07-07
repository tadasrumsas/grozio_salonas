const { sql } = require("../dbConnection");

// Patikrinti ar vartotojas jau paliko atsiliepimą
exports.findExistingReview = async (userId, procedureId) => {
  const result = await sql`
    SELECT * FROM reviews
    WHERE user_id = ${userId} AND procedure_id = ${procedureId}
  `;
  return result[0]; // jei rado, grąžina review objektą
};

// Atnaujinti tūro vidutinį reitingą
const updateProcedureRating = async (procedureId) => {
  await sql`
    UPDATE procedures
    SET rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE procedure_id = ${procedureId}
    )
    WHERE id = ${procedureId};
  `;
};

// Sukurti naują atsiliepimą ir atnaujinti tūro reitingą
exports.createReviewModel = async (userId, procedureId, rating, comment) => {
  const result = await sql`
    INSERT INTO reviews (user_id, procedure_id, rating, comment)
    VALUES (${userId}, ${procedureId}, ${rating}, ${comment})
    RETURNING *;
  `;

  // Po įterpimo atnaujinam tūro vidutinį reitingą
  await updateProcedureRating(procedureId);

  return result[0];
};

exports.getUserReviews = async (userId) => {
  const result = await sql`
    SELECT reviews.*, procedures.title, procedures.image
    FROM reviews
    LEFT JOIN procedures ON reviews.procedure_id = procedures.id
    WHERE reviews.user_id = ${userId}
  `;
  return result;
};

// Gauti visus atsiliepimus konkrečiam turui
exports.getReviewsByProcedureIdModel = async (procedureId) => {
  const result = await sql`
    SELECT 
      reviews.*, 
      users.name AS user_name 
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    WHERE reviews.procedure_id = ${procedureId}
    ORDER BY reviews.created_at DESC;
  `;
  return result;
};
