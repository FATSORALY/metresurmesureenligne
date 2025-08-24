import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../services/auth';
import '../../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companySize: '',
    location: '',
    activityDomains: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const activityDomainsList = [
    'Peinture',
    'Revêtement de sols',
    'Plâtrerie',
    'Menuiserie',
    'Électricité',
    'Plomberie',
    'Maçonnerie',
    'Toiture',
    'Isolation'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const updatedDomains = checked 
        ? [...formData.activityDomains, value]
        : formData.activityDomains.filter(domain => domain !== value);
      
      setFormData({
        ...formData,
        activityDomains: updatedDomains
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <h3 className="auth-title">Informations personnelles</h3>
      
      <div className="form-group">
        <label htmlFor="name" className="form-label">Nom complet</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Votre nom complet"
        />
      </div>
      
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
          placeholder="Créez un mot de passe"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirmez votre mot de passe"
        />
      </div>
      
      <button type="button" className="auth-btn" onClick={nextStep}>
        Suivant
      </button>
    </>
  );

  const renderStep2 = () => (
    <>
      <h3 className="auth-title">Informations entreprise</h3>
      
      <div className="form-group">
        <label htmlFor="companyName" className="form-label">Nom de l'entreprise</label>
        <input
          type="text"
          className="form-control"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          placeholder="Nom de votre entreprise"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="companySize" className="form-label">Taille de l'entreprise</label>
        <select
          className="form-control"
          id="companySize"
          name="companySize"
          value={formData.companySize}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionner...</option>
          <option value="micro">Micro-entreprise</option>
          <option value="small">Petite entreprise (1-9 salariés)</option>
          <option value="medium">Moyenne entreprise (10-49 salariés)</option>
          <option value="large">Grande entreprise (50+ salariés)</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="location" className="form-label">Localisation</label>
        <input
          type="text"
          className="form-control"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder="Ville, région"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Domaines d'activité</label>
        <div className="row">
          {activityDomainsList.map(domain => (
            <div key={domain} className="col-md-6 mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={domain}
                  value={domain}
                  checked={formData.activityDomains.includes(domain)}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor={domain}>
                  {domain}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="d-flex gap-2">
        <button type="button" className="auth-btn btn-secondary" onClick={prevStep}>
          Précédent
        </button>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Création...' : 'Créer le compte'}
        </button>
      </div>
    </>
  );

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-hero">
          <div className="auth-hero-content">
            <h1>Rejoignez-nous</h1>
            <p>Créez votre compte professionnel et accédez à tous nos services de métré</p>
            
            <div className="auth-features">
              <div className="auth-feature">
                <i className="fas fa-check-circle"></i>
                <span>Service de métré précis</span>
              </div>
              <div className="auth-feature">
                <i className="fas fa-check-circle"></i>
                <span>Alertes projets personnalisées</span>
              </div>
              <div className="auth-feature">
                <i className="fas fa-check-circle"></i>
                <span>Support technique dédié</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-container">
          <div className="auth-header">
            <div className="auth-logo">
              <i className="fas fa-ruler-combined"></i>
            </div>
            <h2 className="auth-title">Créer un compte</h2>
            <p className="auth-subtitle">Étape {currentStep} sur 2</p>
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </form>
          
          <div className="auth-links">
            <p>
              Déjà un compte? <Link to="/login" className="auth-link">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;