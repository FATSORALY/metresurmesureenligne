const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('./config/database');
const path = require('path');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const chatRoutes = require('./routes/chat');
const ecommerceRoutes = require('./routes/ecommerce');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// Middleware de base
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration Passport
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await db.query('SELECT id, email, name FROM users WHERE id = $1', [jwt_payload.id]);
    if (user.rows.length > 0) {
      return done(null, user.rows[0]);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

app.use(passport.initialize());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ecommerce', ecommerceRoutes);

// Configuration pour la production
if (process.env.NODE_ENV === 'production') {
  // Servir les fichiers statiques du frontend
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Route de santé pour vérifier le statut du serveur
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'Server is running', 
      timestamp: new Date().toISOString() 
    });
  });

  // Pour toutes les autres routes, renvoyer index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Création du serveur HTTP et WebSocket
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_room', (data) => {
    socket.join(data.room);
    console.log(`User ${socket.id} joined room ${data.room}`);
  });
  
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Démarrage du serveur
server.listen(PORT, HOST, async () => {
  console.log(`🚀 Serveur démarré sur ${HOST}:${PORT}`);
  console.log(`🌐 Environnement: ${process.env.NODE_ENV}`);
  
  try {
    await db.query('SELECT NOW()');
    console.log('✅ Connecté à la base de données');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
  }
});

// Gestion des erreurs
process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Le port ${PORT} est déjà utilisé`);
  } else {
    console.error('❌ Erreur non gérée:', err);
  }
  process.exit(1);
});