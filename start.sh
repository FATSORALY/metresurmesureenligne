#!/bin/sh
# start.sh

echo "🚀 Démarrage de l'application MetreSurMesure..."

# Configuration de la base de données Render
if [ ! -z "$DATABASE_URL" ]; then
  echo "📦 Configuration de la base de données Render..."
  # Format: postgresql://user:password@host:port/database
  export DB_HOST=$(echo $DATABASE_URL | cut -d@ -f2 | cut -d: -f1)
  export DB_PORT=5432  # Render utilise toujours le port 5432
  export DB_NAME=$(echo $DATABASE_URL | cut -d/ -f4)
  export DB_USER=$(echo $DATABASE_URL | cut -d@ -f1 | cut -d: -f2 | cut -d/ -f3)
  export DB_PASSWORD=$(echo $DATABASE_URL | cut -d@ -f1 | cut -d: -f3)
  
  echo "   - DB_HOST: $DB_HOST"
  echo "   - DB_USER: $DB_USER"
  echo "   - DB_NAME: $DB_NAME"
fi

# Vérifier les variables d'environnement
echo "🔧 Configuration:"
echo "   - NODE_ENV: ${NODE_ENV:-production}"
echo "   - PORT: ${PORT:-5000}"
echo "   - HOST: ${HOST:-0.0.0.0}"

# Démarrer l'application
echo "🌐 Démarrage du serveur..."
cd /app/backend

# Utiliser le port fourni par Render
export PORT=${PORT:-5000}
export HOST=${HOST:-0.0.0.0}

exec node server.js