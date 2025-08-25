const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Exécuter les migrations SQL
    const migrationSQL = fs.readFileSync(path.join(__dirname, '../database/init.sql'), 'utf8');
    await pool.query(migrationSQL);
    console.log('✅ Migrations appliquées avec succès');
  } catch (error) {
    console.error('❌ Erreur de migration:', error);
  } finally {
    await pool.end();
  }
}

migrate();