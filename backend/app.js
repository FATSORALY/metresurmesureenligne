const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('./config/database');
const adminRoutes = require('./routes/admin');

const indexRoutes = require('./routes/index');

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const chatRoutes = require('./routes/chat');
const ecommerceRoutes = require('./routes/ecommerce');


const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.1.115:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport configuration
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret_here'
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
app.use('/api', indexRoutes);  // Route racine pour /api
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ecommerce', ecommerceRoutes);
app.use('/api/admin', adminRoutes);
// Health check endpoint pour Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});


// Route racine de l'API - DOIT ÊTRE AVANT LES AUTRES ROUTES
//app.get('/api', (req, res) => {
//  res.json({ 
//    message: 'API MetreSurMesure fonctionne!', 
//    version: '1.0.0',
////    endpoints: {
//      auth: '/api/auth',
//      projects: '/api/projects',
//      chat: '/api/chat',
//      ecommerce: '/api/ecommerce'
//    }
//  });
//});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Route de base pour tester l'API
app.get('/api', (req, res) => {
  res.json({ message: 'API MetreSurMesure is working!', version: '1.0.0' });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler - DOIT ÊTRE LA DERNIÈRE ROUTE
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;