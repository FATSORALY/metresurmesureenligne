const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

// Route de déconnexion
router.post('/logout', auth, (req, res) => {
  // Ici vous pourriez blacklister le token si nécessaire
  res.json({ message: 'Déconnexion réussie' });
});

module.exports = router;