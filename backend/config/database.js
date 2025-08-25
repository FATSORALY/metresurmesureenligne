const { Pool } = require('pg');
require('dotenv').config();

// Configuration pour Render et développement local
const isProduction = process.env.NODE_ENV === 'production';

let connectionConfig;

if (isProduction) {
  // En production (Render), utiliser DATABASE_URL avec SSL
  connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  // En développement local
  connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'metresurmesure',
    user: process.env.DB_USER || 'metresuser',
    password: process.env.DB_PASSWORD || 'metrespwd',
  };
}

const pool = new Pool(connectionConfig);

// Test de connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
  } else {
    console.log('✅ Connecté à la base de données');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};