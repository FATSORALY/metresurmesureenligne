const express = require('express');
const { getMessages, sendMessage, getConversations } = require('../controllers/chatController');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');

const router = express.Router();

router.use(auth);

router.get('/messages', (req, res, next) => {
  getMessages(req, res).catch(next);
});

router.post('/messages', (req, res, next) => {
  sendMessage(req, res).catch(next);
});

router.get('/conversations', requireAdmin, (req, res, next) => {
  getConversations(req, res).catch(next);
});

// Middleware de gestion d'erreurs
router.use((error, req, res, next) => {
  console.error('Chat route error:', error);
  res.status(500).json({ 
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
  });
});

module.exports = router;