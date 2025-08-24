import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="d-flex align-items-center mb-3">
              <img 
                src="/logo.png" 
                alt="MetreSurMesure Logo" 
                style={{ 
                  height: '60px', 
                  width: '60px', 
                  marginRight: '12px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h5 style={{ color: '#FFFDE2', margin: 0, fontSize: '1.5rem' }}>MetreSurMesure</h5>
            </div>
            <p style={{ color: '#FFFDE2', fontSize: '1rem' }}>
              Service professionnel de métré en ligne pour les entreprises du BTP. 
              Optimisez vos chances de remporter des appels d'offres avec nos calculs précis.
            </p>
          </div>
          
          <div className="col-md-2 mb-4">
            <h5 style={{ color: '#FFFDE2' }}>Liens rapides</h5>
            <ul className="list-unstyled">
              <li><a href="/" style={{ color: '#FFFDE2' }}>Accueil</a></li>
              <li><a href="/marketplace" style={{ color: '#FFFDE2' }}>Boutique</a></li>
              <li><a href="/projects" style={{ color: '#FFFDE2' }}>Projets</a></li>
              <li><a href="/dashboard" style={{ color: '#FFFDE2' }}>Dashboard</a></li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4">
            <h5 style={{ color: '#FFFDE2' }}>Services</h5>
            <ul className="list-unstyled">
              <li><a href="/" style={{ color: '#FFFDE2' }}>Métré de plans</a></li>
              <li><a href="/" style={{ color: '#FFFDE2' }}>Calculs de surfaces</a></li>
              <li><a href="/" style={{ color: '#FFFDE2' }}>Devis précis</a></li>
              <li><a href="/" style={{ color: '#FFFDE2' }}>Alertes projets</a></li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4">
            <h5 style={{ color: '#FFFDE2' }}>Contact</h5>
            <ul className="list-unstyled">
              <li style={{ color: '#FFFDE2' }}><i className="fas fa-envelope me-2"></i> contact@metresurmesure.fr</li>
              <li style={{ color: '#FFFDE2' }}><i className="fas fa-phone me-2"></i> +33 1 23 45 67 89</li>
              <li style={{ color: '#FFFDE2' }}><i className="fas fa-map-marker-alt me-2"></i> Paris, France</li>
            </ul>
            <div className="mt-3">
              <a href="#" className="me-3"><i className="fab fa-facebook-f fa-lg" style={{ color: '#FFFDE2' }}></i></a>
              <a href="#" className="me-3"><i className="fab fa-twitter fa-lg" style={{ color: '#FFFDE2' }}></i></a>
              <a href="#" className="me-3"><i className="fab fa-linkedin-in fa-lg" style={{ color: '#FFFDE2' }}></i></a>
              <a href="#"><i className="fab fa-instagram fa-lg" style={{ color: '#FFFDE2' }}></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p style={{ color: '#FFFDE2', margin: 0 }}>&copy; 2023 MetreSurMesure. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;