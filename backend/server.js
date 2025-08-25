const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('./config/database');
const app = require('./app');
const path = require('path'); // ito
require('dotenv').config();


const PORT = process.env.PORT || 5000;
//const PORT = process.env.PORT || 5000;
// Configuration pour Render.com
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const express = require('express');
  
  // Servir les fichiers statiques
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Pour toutes les autres routes, renvoyer index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Démarrer le serveur
app.listen(PORT, HOST, async () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🌐 Environnement: ${process.env.NODE_ENV}`);
  
  try {
    // Tester la connexion à la base de données
    await db.query('SELECT NOW()');
    console.log('✅ Connecté à la base de données');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
  }
});

// Gestion propre des erreurs de port
process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Le port ${PORT} est déjà utilisé`);
    console.log('🔄 Tentative de redémarrage sur un port différent...');
    // Ne pas quitter le processus, laisser Render gérer le redémarrage
  } else {
    console.error('❌ Erreur non gérée:', err);
    process.exit(1);
  }
});

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const chatRoutes = require('./routes/chat');
const ecommerceRoutes = require('./routes/ecommerce');


// const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport configuration
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || '02a1cc8cfba732c5df138a76f718c2c5685994399a0d735c0f45ff0a441bd0abfc2fe67d133c2562733e2b2a622e2bea03c12bef3d133f0de53a2843fcdf9a72'
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




// Routes
app.use('/api', require('./routes')); // ito
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ecommerce', ecommerceRoutes);

//app.listen(PORT, '0.0.0.0', () => {
//  console.log(`Server running on port ${PORT}`);
//});

// Socket.io for real-time chat
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






server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});