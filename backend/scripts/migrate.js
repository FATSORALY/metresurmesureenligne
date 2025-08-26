const { Pool } = require('pg');
require('dotenv').config();

async function runMigrations() {
  console.log('🚀 Running database migrations...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Migration: Ajouter les colonnes admin si elles n'existent pas
    const migrations = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE`,
      
      `INSERT INTO users (name, email, password, is_super_admin, is_admin, company_name, location, activity_domains) 
       VALUES (
         'Super Admin', 
         'superadmin@metresurmesure.com', 
         '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
         TRUE, 
         TRUE,
         'MetreSurMesure',
         'Paris',
         ARRAY['Administration']::TEXT[]
       ) ON CONFLICT (email) DO NOTHING`
    ];

    for (const migration of migrations) {
      await pool.query(migration);
      console.log('✅ Migration executed:', migration.substring(0, 50) + '...');
    }

    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
  } finally {
    await pool.end();
  }
}

// Exécuter seulement si appelé directement
if (require.main === module) {
  runMigrations().catch(console.error);
}

module.exports = { runMigrations };