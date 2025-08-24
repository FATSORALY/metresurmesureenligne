const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test de connexion
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Erreur email:', error);
  } else {
    console.log('✅ Serveur email configuré');
  }
});

module.exports = transporter;