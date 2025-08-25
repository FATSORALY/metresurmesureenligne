#!/bin/sh
# start.sh

echo "🚀 Démarrage de l'application MetreSurMesure..."

# Configuration de la base de données Render
if [ ! -z "$DATABASE_URL" ]; then
  echo "📦 Configuration de la base de données Render..."
  # Format: postgresql://user:password@host:port/database
  export DB_HOST=$(echo $DATABASE_URL | cut -d@ -f2 | cut -d: -f1)
  export DB_PORT=$(echo $DATABASE_URL | cut -d: -f4 | cut -d/ -f1)
  export DB_NAME=$(echo $DATABASE_URL | cut -d/ -f4)
  export DB_USER=$(echo $DATABASE_URL | cut -d@ -f1 | cut -d: -f2 | cut -d/ -f3)
  export DB_PASSWORD=$(echo $DATABASE_URL | cut -d@ -f1 | cut -d: -f3)
fi

# Vérifier les variables d'environnement
echo "🔧 Configuration:"
echo "   - NODE_ENV: ${NODE_ENV:-development}"
echo "   - PORT: ${PORT:-5000}"
echo "   - DB_HOST: ${DB_HOST:-localhost}"

# Démarrer l'application
echo "🌐 Démarrage du serveur..."
cd /app/backend
node server.js