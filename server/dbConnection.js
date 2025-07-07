const postgres = require('postgres');
require('dotenv').config(); 


const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const sql = postgres(connectionString);


const testConnection = async () => {
  try {
    await sql`SELECT 1 AS result`;
    console.log('✅ Connection to database successful');
  } catch (error) {
    console.error('❌ Connection to database failed:', error);
    throw error; 
  }
};

module.exports = { sql, testConnection };
