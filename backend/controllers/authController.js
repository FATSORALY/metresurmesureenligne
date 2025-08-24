const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { sendWelcomeEmail } = require('../utils/emailService');

const register = async (req, res) => {
  console.log('Register request received:', req.body);
  
  const { name, email, password, companyName, companySize, location, activityDomains } = req.body;

  try {
    // Validation des données
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nom, email et mot de passe sont requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insérer l'utilisateur dans la base de données
    const newUser = await db.query(
      `INSERT INTO users (name, email, password, company_name, company_size, location, activity_domains) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, company_name, company_size, location, activity_domains`,
      [name, email, hashedPassword, companyName, companySize, location, activityDomains]
    );

    // Générer un token JWT
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET || 'your_jwt_secret_here',
      { expiresIn: '7d' }
    );

    console.log('User registered successfully:', newUser.rows[0].email);

    // Envoyer un email de bienvenue (optionnel)
    try {
      await sendWelcomeEmail(newUser.rows[0]);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Ne pas échouer l'inscription à cause de l'email
    }

    res.status(201).json({
      token,
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET || 'your_jwt_secret_here',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        companyName: user.rows[0].company_name,
        companySize: user.rows[0].company_size,
        location: user.rows[0].location,
        activityDomains: user.rows[0].activity_domains
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await db.query(
      'SELECT id, name, email, company_name, company_size, location, activity_domains FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(user.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  register,
  login,
  getMe
};