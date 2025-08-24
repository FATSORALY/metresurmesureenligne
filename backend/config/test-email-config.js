const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('🧪 Test de configuration Gmail...');
    
    // Test de connexion
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie!');

    // Test d'envoi
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Envoyer à vous-même pour le test
      subject: 'Test de configuration MetreSurMesure',
      html: '<h2>✅ Email de test réussi!</h2><p>Votre configuration Gmail fonctionne correctement.</p>'
    });

    console.log('✅ Email de test envoyé avec succès!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 SOLUTIONS:');
      console.log('1. Activez la validation en 2 étapes sur Google');
      console.log('2. Générez un mot de passe d\'application');
      console.log('3. Utilisez le mot de passe d\'application (16 caractères)');
      console.log('4. Assurez-vous que les apps moins sécurisées sont activées');
    }
  }
}

testEmail();