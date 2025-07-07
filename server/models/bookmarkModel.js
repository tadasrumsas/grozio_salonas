const { sql } = require("../dbConnection");

exports.createBookmark = async (userId, procedureId) => {
  const result = await sql`
    INSERT INTO bookmarks (user_id, procedure_id)
    VALUES (${userId}, ${procedureId})
    RETURNING *;
  `;
  return result[0];
};

exports.deleteBookmark = async (userId, procedureId) => {
  const result = await sql`
    DELETE FROM bookmarks
    WHERE user_id = ${userId} AND procedure_id = ${procedureId}
    RETURNING *;
  `;
  return result[0];
};

exports.getUserBookmarks = async (userId) => {
  const bookmarks = await sql`
    SELECT 
      bookmarks.id AS bookmark_id,
      procedures.id AS procedure_id,
      procedures.title,
      procedures.image,
      procedures.description,
      procedures.location,
      procedures.duration,
      procedures.price,
      procedures.rating,
      categories.name AS category_name
    FROM bookmarks
    LEFT JOIN procedures ON bookmarks.procedure_id = procedures.id
    LEFT JOIN categories ON procedures.category_id = categories.id
    WHERE bookmarks.user_id = ${userId}
    ORDER BY bookmarks.created_at DESC;
  `;
  return bookmarks;
};

exports.checkBookmarkExists = async (userId, procedureId) => {
  const result = await sql`
    SELECT * FROM bookmarks
    WHERE user_id = ${userId} AND procedure_id = ${procedureId}
  `;
  return result[0];
};
