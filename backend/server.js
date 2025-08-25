const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('./config/database');
const app = require('./app');
const path = require('path'); // ito

//const PORT = process.env.PORT || 5000;

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
  origin: [
    'https://metresurmesure-frontend.onrender.com',
    'http://localhost:3000'
  ],
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


// Servir les fichiers static en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});