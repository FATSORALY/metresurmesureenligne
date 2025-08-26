# Dockerfile
FROM node:16-alpine as backend-build

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

FROM node:16-alpine as frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Image finale
FROM node:16-alpine

WORKDIR /app

# Installer PostgreSQL client et autres dépendances
RUN apk add --no-cache postgresql-client

# Copier le backend
COPY --from=backend-build /app/backend /app/backend
COPY --from=frontend-build /app/frontend/build /app/frontend/build

# Installer les dépendances du backend
WORKDIR /app/backend
RUN npm install --production

# Exposer le port
EXPOSE 5000



CMD ["/app/start.sh"]