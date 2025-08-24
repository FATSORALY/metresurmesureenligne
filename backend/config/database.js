const { Pool } = require('pg');

// Configuration pour Render
const connectionString = process.env.DATABASE_URL || {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'metresurmesure',
  user: process.env.DB_USER || 'metresuser',
  password: process.env.DB_PASSWORD || 'metrespwd',
};

const pool = new Pool(
  typeof connectionString === 'string' 
    ? { connectionString, ssl: { rejectUnauthorized: false } }
    : connectionString
);

module.exports = {
  query: (text, params) => pool.query(text, params),
};