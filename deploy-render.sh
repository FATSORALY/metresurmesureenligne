#!/bin/bash
# deploy-render.sh

echo "🚀 Déploiement sur Render.com..."

# Vérification des fichiers
if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile manquant"
    exit 1
fi

if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml manquant"
    exit 1
fi

# Construction de l'image Docker
echo "📦 Construction de l'image Docker..."
docker build -t metresurmesure .

# Connexion à Render (si l'CLI est installé)
if command -v render &> /dev/null; then
    echo "🔗 Connexion à Render..."
    render login
fi

echo "✅ Configuration prête pour le déploiement!"
echo ""
echo "📋 Étapes manuelles:"
echo "1. Allez sur https://dashboard.render.com"
echo "2. Cliquez sur 'New +' → 'Web Service'"
echo "3. Connectez votre repository GitHub"
echo "4. Sélectionnez le Dockerfile"
echo "5. Configurez les variables d'environnement"
echo "6. Déployez!"
echo ""
echo "🌐 URL: https://metresurmesureenligne.onrender.com"