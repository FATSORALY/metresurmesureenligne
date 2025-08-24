// Frontend/src/pages/Profile.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../services/auth';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    companyName: user?.companyName || '',
    companySize: user?.companySize || '',
    location: user?.location || '',
    activityDomains: user?.activityDomains || []
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mettre à jour le profil
    alert('Profil mis à jour!');
  };

  if (!user) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div className="container my-5">
      <div className="auth-container">
        <h2 className="text-center mb-4">Mon Profil</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">Nom complet</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Nom de l'entreprise</label>
            <input
              type="text"
              className="form-control"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="companySize" className="form-label">Taille de l'entreprise</label>
              <select
                className="form-select"
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
            
            <div className="col-md-6 mb-3">
              <label htmlFor="location" className="form-label">Localisation</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
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
          
          <button type="submit" className="btn btn-primary w-100 py-2">
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;