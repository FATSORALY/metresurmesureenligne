-- Ajouter les colonnes d'administration si elles n'existent pas
DO $$ 
BEGIN
    -- Vérifier et ajouter is_admin
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;

    -- Vérifier et ajouter is_super_admin
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_super_admin'
    ) THEN
        ALTER TABLE users ADD COLUMN is_super_admin BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Mettre à jour ou insérer le super administrateur
INSERT INTO users (name, email, password, is_super_admin, is_admin, company_name, location, activity_domains) 
VALUES (
    'Super Admin', 
    'superadmin@metresurmesure.com', 
    'admin123',  -- Mot de passe en clair
    TRUE, 
    TRUE,
    'MetreSurMesure',
    'Paris',
    ARRAY['Administration']::TEXT[]
) 
ON CONFLICT (email) 
DO UPDATE SET
    password = EXCLUDED.password,
    is_super_admin = EXCLUDED.is_super_admin,
    is_admin = EXCLUDED.is_admin,
    name = EXCLUDED.name,
    company_name = EXCLUDED.company_name,
    location = EXCLUDED.location;

-- Vérification
SELECT id, name, email, is_admin, is_super_admin 
FROM users 
WHERE email = 'superadmin@metresurmesure.com';