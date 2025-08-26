# Configuration PlanetHoster

## 1. Configuration DNS
- Allez dans votre panel PlanetHoster
- Configurez les records DNS:
  - A: @ → IP de votre serveur
  - A: www → IP de votre serveur
  - CNAME: *.votre-domaine.com → votre-domaine.com

## 2. Configuration du Serveur
- Assurez-vous que Docker est installé
- Ouvrez les ports 80 et 443 dans le firewall

## 3. SSL avec Let's Encrypt
ssh utilisateur@votre-domaine.com
sudo certbot certonly --standalone -d votre-domaine.com -d www.votre-domaine.com

## 4. Copiez les certificats
cp /etc/letsencrypt/live/votre-domaine.com/fullchain.pem ./ssl/
cp /etc/letsencrypt/live/votre-domaine.com/privkey.pem ./ssl/