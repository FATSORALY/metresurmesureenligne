const db = require('../config/database');

const requireAdmin = async (req, res, next) => {
  try {
    const user = await db.query(
      'SELECT id, name, email, is_admin, is_super_admin FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(403).json({ message: 'Utilisateur non trouvé' });
    }

    if (!user.rows[0].is_admin && !user.rows[0].is_super_admin) {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }

    req.user.is_admin = user.rows[0].is_admin;
    req.user.is_super_admin = user.rows[0].is_super_admin;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const requireSuperAdmin = async (req, res, next) => {
  try {
    const user = await db.query(
      'SELECT id, name, email, is_super_admin FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(403).json({ message: 'Utilisateur non trouvé' });
    }

    if (!user.rows[0].is_super_admin) {
      return res.status(403).json({ message: 'Accès réservé aux super administrateurs' });
    }

    req.user.is_super_admin = user.rows[0].is_super_admin;
    next();
  } catch (error) {
    console.error('Super admin auth error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { requireAdmin, requireSuperAdmin };