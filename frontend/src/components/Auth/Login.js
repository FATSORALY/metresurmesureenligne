import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../services/auth';
import '../../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-hero">
          <div className="auth-hero-content">
            <h1>MetreSurMesure</h1>
            <p>Service professionnel de métré en ligne pour les entreprises du BTP</p>
            
            <div className="auth-features">
              <div className="auth-feature">
                <i className="fas fa-ruler-combined"></i>
                <span>Calculs de métré précis</span>
              </div>
              <div className="auth-feature">
                <i className="fas fa-bell"></i>
                <span>Alertes personnalisées</span>
              </div>
              <div className="auth-feature">
                <i className="fas fa-file-invoice-dollar"></i>
                <span>Devis optimisés</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-container">
          <div className="auth-header">
            <div className="auth-logo">
              <i className="fas fa-ruler-combined"></i>
            </div>
            <h2 className="auth-title">Connexion</h2>
            <p className="auth-subtitle">Accédez à votre espace professionnel</p>
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre@email.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Votre mot de passe"
              />
            </div>
            
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="remember" />
              <label className="form-check-label" htmlFor="remember">
                Se souvenir de moi
              </label>
            </div>
            
            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          
          <div className="auth-links">
            <p>
              Pas encore de compte? <Link to="/register" className="auth-link">Créer un compte</Link>
            </p>
            <p>
              <Link to="/forgot-password" className="auth-link">Mot de passe oublié?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;