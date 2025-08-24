-- Database/seed/001_initial_data.sql
-- Données initiales pour peupler la base

-- Insertion de produits de démonstration
INSERT INTO products (name, description, price, category, image_url) VALUES
('Service de métré basique', 'Analyse de plans et calcul des surfaces pour projets résidentiels', 299.99, 'service', 'https://via.placeholder.com/300x200?text=Service+Basique'),
('Service de métré avancé', 'Analyse complète avec quantification des matériaux et estimation des coûts', 599.99, 'service', 'https://via.placeholder.com/300x200?text=Service+Avancé'),
('Audit de projet', 'Vérification et validation des métrés existants', 399.99, 'service', 'https://via.placeholder.com/300x200?text=Audit'),
('Formation au métré', 'Session de formation de 2 jours aux techniques de métré', 899.99, 'formation', 'https://via.placeholder.com/300x200?text=Formation');

-- Insertion de quelques projets publics de démonstration
INSERT INTO projects (user_id, title, description, location, location_point, status) VALUES
(1, 'Rénovation appartement Paris', 'Rénovation complète d''un appartement de 75m² dans le 11ème arrondissement', 'Paris', ST_SetSRID(ST_MakePoint(2.379, 48.857), 4326), 'completed'),
(1, 'Extension maison Versailles', 'Construction d''une extension de 40m² pour une maison individuelle', 'Versailles', ST_SetSRID(ST_MakePoint(2.130, 48.801), 4326), 'in_progress'),
(1, 'Bureaux Lyon Part-Dieu', 'Aménagement de bureaux sur 300m² dans le quartier d''affaires', 'Lyon', ST_SetSRID(ST_MakePoint(4.856, 45.764), 4326), 'pending');