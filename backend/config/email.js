const nodemailer = require('nodemailer');

// Vérifier que les variables d'environnement sont définies
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️ Variables d\'environnement email non définies. L\'envoi d\'email sera désactivé.');
  
  // Créer un transporteur factice pour le développement
  module.exports = {
    sendMail: (options, callback) => {
      console.log('📧 Email simulé (variables d\'environnement non définies)');
      console.log('Destinataire:', options.to);
      console.log('Sujet:', options.subject);
      callback(null, { messageId: 'simulated-message-id' });
    }
  };
} else {
  // Configuration réelle pour la production
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
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
}