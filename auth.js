const mysql = require('mysql2/promise') // Use promise-based mysql2 for async/await
require('dotenv').config()

// Development & Production variables
const dbHost = process.env.DEV_URL
const dbPort =
  process.env.NODE_ENV === 'DEV' ? process.env.DB_PORT : process.env.LIVE_PORT
const dbName = process.env.AUTH_NAME
const dbUser = process.env.AUTH_USER
const dbPass = process.env.AUTH_PASS

console.log(dbHost)
console.log(dbPort)
console.log(dbName)
console.log(dbUser)
console.log(dbPass)

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
    queueLimit: 0,
  })

  return pool
}
module.exports = createPool
