# Pour un projet Node.js
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]

# OU pour un projet Python
FROM python:3.9-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "app.py"]

# OU pour un projet static (HTML/CSS/JS)
FROM nginx:alpine
COPY . /usr/share/nginx/html