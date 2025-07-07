const app = require('./app');
require('dotenv').config(); 
const { sql, testConnection } = require('./dbConnection');

const port = process.env.PORT || 3000;

(async () => {
  try {
    
    await testConnection();

   
    app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });
  } catch (error) {
    process.exit(1);
  }

  
  process.on('SIGINT', async () => {
    console.log('Closing database connections...');
    await sql.end(); 
    process.exit(0);
  });
})();
