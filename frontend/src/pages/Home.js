// Frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Service professionnel de métré en ligne</h1>
          <p>Optimisez vos chances de remporter des appels d'offres avec nos calculs de métré précis et fiables</p>
          <div className="mt-4">
            <Link to="/register" className="btn btn-primary btn-lg me-3" style={{ color: '#F7B500 ',}}>
              Commencer gratuitement
            </Link>
            <Link to="/marketplace" className="btn btn-outline-light btn-lg">
              Découvrir nos services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ color: '#ecf0f1 ',}}> Nos services</h2>
            <p className="lead" style={{ color: '#ecf0f1 ',}}>Découvrez comment nous pouvons vous aider à gagner du temps et à améliorer votre précision</p>
          </div>
          
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-ruler-combined" style={{ color: '#F7B500 ',}}></i>
                </div>
                <h4>Métré précis</h4>
                <p>Calculs de surfaces et volumes précis à partir de vos plans, avec une validation par des experts.</p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-bell" style={{ color: '#F7B500 ',}}></i>
                </div>
                <h4>Alertes personnalisées</h4>
                <p>Soyez informé des nouveaux appels d'offres correspondant à vos critères et localisation.</p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-file-invoice-dollar" style={{ color: '#F7B500 ',}}></i>
                </div>
                <h4>Devis optimisés</h4>
                <p>Générez des devis précis pour augmenter vos chances de remporter des marchés.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <h3 className="text-primary">87</h3>
              <p>Appels d'offres actifs</p>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <h3 className="text-primary">12,577</h3>
              <p>Métrés réalisés</p>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <h3 className="text-primary">34</h3>
              <p>Départements couverts</p>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <h3 className="text-primary">98%</h3>
              <p>Clients satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2>Prêt à optimiser votre processus de métré?</h2>
          <p className="lead mb-4">Rejoignez des centaines d'entreprises du BTP qui nous font déjà confiance</p>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ color: '#F7B500 ',}}>
            Créer un compte gratuit
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;