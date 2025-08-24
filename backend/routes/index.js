const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    message: 'API MetreSurMesure',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      chat: '/api/chat',
      ecommerce: '/api/ecommerce'
    }
  });
});

module.exports = router;