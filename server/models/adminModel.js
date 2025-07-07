const { sql } = require('../dbConnection');

exports.banUserById = async (userId) => {
  await sql`UPDATE users SET is_banned = true WHERE id = ${userId}`;
};

exports.unbanUserById = async (userId) => {
  await sql`UPDATE users SET is_banned = false WHERE id = ${userId}`;
};

exports.getAllUsers = async () => {
  return await sql`SELECT id, name, email, role, is_banned FROM users`;
};
