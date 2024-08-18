const mysql = require('mysql2/promise'); // Use promise-based mysql2 for async/await
require('dotenv').config();

// Development & Production variables
// const connect = process.env.NODE_ENV === 'development' ? process.env.DEV_CONNECT : process.env.PROD_CONNECT;
const dbHost = process.env.NODE_ENV === 'DEV' ? process.env.DEV_URL : process.env.LIVE_URL
const dbPort = process.env.NODE_ENV === 'DEV' ? process.env.DEgitV_PORT : process.env.LIVE_PORT
const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

/* -------------------------------------------------------------------------- */
/*                       MySQL connection configuration                       */
/* -------------------------------------------------------------------------- */

async function createPool() {
const pool = mysql.createPool({
  host: dbHost, 
  user: dbUser,
  password: dbPass,
  database: dbName,
  port: dbPort, // Conditional port based on environment
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your requirements
  queueLimit: 0
});



return pool;
}
module.exports = createPool;