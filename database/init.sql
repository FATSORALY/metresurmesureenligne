-- database/init.sql
-- Créer la base de données seulement si elle n'existe pas
SELECT 'CREATE DATABASE metresurmesure'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'metresurmesure')\gexec

-- Se connecter à la base de données nouvellement créée
\c metresurmesure

-- Créer l'extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    location VARCHAR(255),
    activity_domains TEXT[],
    preferences JSONB DEFAULT '{}',
    is_admin BOOLEAN DEFAULT FALSE,
    is_super_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des projets (utilisant le type geography de PostGIS)
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    location_point geography(Point, 4326),
    status VARCHAR(50) DEFAULT 'pending',
    documents TEXT[],
    measurements JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits (e-commerce)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des commandes avec informations de paiement (version unique)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    stripe_session_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des transactions
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'eur',
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des messages de chat
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects USING GIST(location_point);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);

-- Insertion de produits de démonstration
INSERT INTO products (name, description, price, category, image_url) VALUES
('Service de métré basique', 'Analyse de plans et calcul des surfaces pour projets résidentiels', 299.99, 'service', 'https://via.placeholder.com/300x200?text=Service+Basique'),
('Service de métré avancé', 'Analyse complète avec quantification des matériaux et estimation des coûts', 599.99, 'service', 'https://via.placeholder.com/300x200?text=Service+Avancé'),
('Audit de projet', 'Vérification et validation des métrés existants', 399.99, 'service', 'https://via.placeholder.com/300x200?text=Audit'),
('Formation au métré', 'Session de formation de 2 jours aux techniques de métré', 899.99, 'formation', 'https://via.placeholder.com/300x200?text=Formation')
ON CONFLICT DO NOTHING;

-- Créer un super administrateur par défaut avec mot de passe en clair
INSERT INTO users (name, email, password, is_super_admin, is_admin, company_name, location) 
VALUES (
  'Super Admin', 
  'superadmin@metresurmesure.com', 
  'password',  -- Mot de passe en clair temporaire
  TRUE, 
  TRUE,
  'MetreSurMesure',
  'Paris'
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  is_super_admin = EXCLUDED.is_super_admin,
  is_admin = EXCLUDED.is_admin;