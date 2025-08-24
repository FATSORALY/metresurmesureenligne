const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');
const { requireAdmin, requireSuperAdmin } = require('../middleware/adminAuth');

const router = express.Router();

// Toutes les routes admin nécessitent un administrateur
router.use(auth);
router.use(requireAdmin);

// Routes accessibles à tous les admins
router.get('/users', async (req, res) => {
  try {
    const users = await db.query(
      'SELECT id, name, email, company_name, location, is_admin, is_super_admin, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes réservées aux super admins
router.patch('/users/:id/promote', requireSuperAdmin, async (req, res) => {
  try {
    const { is_admin } = req.body;
    const updatedUser = await db.query(
      'UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING id, name, email, is_admin',
      [is_admin, req.params.id]
    );
    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Middleware pour vérifier que l'utilisateur est admin
const isAdmin = (req, res, next) => {
  next();
};

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await db.query(
      'SELECT id, name, email, company_name, location, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete user
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get all projects
router.get('/projects', auth, isAdmin, async (req, res) => {
  try {
    const projects = await db.query(
      `SELECT p.*, u.name as user_name 
       FROM projects p 
       LEFT JOIN users u ON p.user_id = u.id 
       ORDER BY p.created_at DESC`
    );
    res.json(projects.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete project
router.delete('/projects/:id', auth, isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ message: 'Projet supprimé' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get all products
router.get('/products', auth, isAdmin, async (req, res) => {
  try {
    const products = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Add new product
router.post('/products', auth, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;
    
    const newProduct = await db.query(
      `INSERT INTO products (name, description, price, category, image_url) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, price, category, image_url]
    );
    
    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update product
router.put('/products/:id', auth, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;
    
    const updatedProduct = await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, category = $4, image_url = $5 
       WHERE id = $6 RETURNING *`,
      [name, description, price, category, image_url, req.params.id]
    );
    
    res.json(updatedProduct.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete product
router.delete('/products/:id', auth, isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;