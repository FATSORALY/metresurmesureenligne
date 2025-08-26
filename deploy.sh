#!/bin/bash
# Script pour configurer SSL avec Let's Encrypt
DOMAIN=metresurmesure.com
EMAIL=arvelandrianantoandro@gmail.com

mkdir -p ssl

# Générer des certificats auto-signés temporaires (à remplacer par Let's Encrypt)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/privkey.pem \
    -out ssl/fullchain.pem \
    -subj "/CN=$DOMAIN"

echo "📜 Certificats SSL générés dans le dossier ssl/"
echo "🔐 Pour Let's Encrypt, utilisez certbot sur PlanetHoster:"
echo "   certbot certonly --webroot -w /var/www/html -d $DOMAIN"