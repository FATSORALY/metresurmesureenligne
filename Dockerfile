# Dockerfile.render
FROM node:18-alpine as backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:18-alpine as production
WORKDIR /app

# Installer serve pour servir le frontend
RUN npm install -g serve

# Copier le backend
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules

# Copier le frontend
COPY --from=frontend-build /app/frontend/build ./frontend-build

# Copier les scripts de démarrage
COPY scripts/ ./scripts/
RUN chmod +x ./scripts/start.sh

# Exposer le port
EXPOSE 5000

# Démarrer l'application
CMD ["./scripts/start.sh"]