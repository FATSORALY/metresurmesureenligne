const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Simulation de paiement - Ignorer Stripe
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Récupérer le produit
    const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Simuler une session de paiement
    const simulatedSession = {
      id: 'simulated_session_' + Date.now(),
      success: true,
      message: 'Paiement simulé avec succès'
    };

    res.json({ 
      id: simulatedSession.id,
      simulated: true // Indique que c'est une simulation
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simulation de webhook de paiement réussi
router.post('/simulate-payment', auth, async (req, res) => {
  try {
    const { sessionId, productId, quantity = 1 } = req.body;

    // Récupérer le produit
    const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Créer la commande dans la base de données
    const order = await db.query(
      `INSERT INTO orders (user_id, product_id, quantity, total_price, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        req.user.id,
        productId,
        quantity,
        product.rows[0].price * quantity,
        'completed'
      ]
    );

    res.json({ 
      success: true, 
      order: order.rows[0],
      message: 'Paiement simulé et commande créée avec succès'
    });
  } catch (error) {
    console.error('Error simulating payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vérifier le statut d'une session (simulation)
router.get('/session-status', auth, async (req, res) => {
  const { session_id } = req.query;

  // Pour les sessions simulées, retourner un statut réussi
  if (session_id && session_id.startsWith('simulated_session_')) {
    return res.json({
      status: 'complete',
      payment_status: 'paid',
      simulated: true
    });
  }

  res.json({
    status: 'unknown',
    payment_status: 'unknown',
    simulated: false
  });
});

module.exports = router;