const { sql } = require('../dbConnection');

exports.createBookmark = async (userId, tourId) => {
  const result = await sql`
    INSERT INTO bookmarks (user_id, tour_id)
    VALUES (${userId}, ${tourId})
    RETURNING *;
  `;
  return result[0];
};

exports.deleteBookmark = async (userId, tourId) => {
  const result = await sql`
    DELETE FROM bookmarks
    WHERE user_id = ${userId} AND tour_id = ${tourId}
    RETURNING *;
  `;
  return result[0];
};

exports.getUserBookmarks = async (userId) => {
  const bookmarks = await sql`
    SELECT 
      bookmarks.id AS bookmark_id,
      tours.id AS tour_id,
      tours.title,
      tours.image,
      tours.description,
      tours.location,
      tours.duration,
      tours.price,
      tours.rating,
      categories.name AS category_name
    FROM bookmarks
    LEFT JOIN tours ON bookmarks.tour_id = tours.id
    LEFT JOIN categories ON tours.category_id = categories.id
    WHERE bookmarks.user_id = ${userId}
    ORDER BY bookmarks.created_at DESC;
  `;
  return bookmarks;
};

exports.checkBookmarkExists = async (userId, tourId) => {
  const result = await sql`
    SELECT * FROM bookmarks
    WHERE user_id = ${userId} AND tour_id = ${tourId}
  `;
  return result[0];
};