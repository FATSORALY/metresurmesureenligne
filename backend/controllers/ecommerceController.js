const db = require('../config/database');

const getProducts = async (req, res) => {
  try {
    // Assurez-vous de sélectionner tous les champs nécessaires, y compris image_url
    const products = await db.query(`
      SELECT id, name, description, price, category, image_url, created_at 
      FROM products 
      ORDER BY created_at DESC
    `);
    res.json(products.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const createOrder = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Vérifier le produit
    const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Créer la commande
    const order = await db.query(
      `INSERT INTO orders (user_id, product_id, quantity, total_price) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, productId, quantity, product.rows[0].price * quantity]
    );
    res.status(201).json(order.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getProducts,
  createOrder
};