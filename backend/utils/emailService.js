const transporter = require('../config/email');

const sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Bienvenue sur MetreSurMesure',
      html: `
        <h2>Bienvenue, ${user.name} !</h2>
        <p>Merci de vous être inscrit sur MetreSurMesure.</p>
        <p>Vous pouvez maintenant accéder à tous nos services de métré en ligne.</p>
        <p><strong>Votre entreprise:</strong> ${user.company_name || 'Non spécifié'}</p>
        <p><strong>Localisation:</strong> ${user.location || 'Non spécifié'}</p>
        <br>
        <p>Cordialement,<br>L'équipe MetreSurMesure</p>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', user.email);
    return { success: true, result };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
};

const sendProjectAlert = async (user, project) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Nouveau projet correspondant à vos critères',
      html: `
        <h2>Nouveau projet disponible</h2>
        <p>Un nouveau projet "${project.title}" correspond à vos critères de recherche.</p>
        <p><strong>Localisation:</strong> ${project.location}</p>
        <p><strong>Description:</strong> ${project.description}</p>
        <a href="${process.env.FRONTEND_URL}/projects/${project.id}">Voir le projet</a>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, result };
  } catch (error) {
    console.error('Error sending project alert:', error);
    return { success: false, error };
  }
};

// Exportez les fonctions correctement
module.exports = {
  sendWelcomeEmail,
  sendProjectAlert
};