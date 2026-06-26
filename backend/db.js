const mysql = require("mysql2/promise");
require("dotenv").config();

// A connection pool maintains a set of reusable DB connections.
// Instead of opening/closing a new connection on every request
// (slow, and can exhaust the DB), the pool hands out an idle
// connection and reclaims it when the query finishes.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
