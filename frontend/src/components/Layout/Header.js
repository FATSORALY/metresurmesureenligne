import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../services/auth';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="header" style={{ backgroundColor: '#2c3e50' }}>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            {/* Logo plus grand */}
            <img 
              src="/logo.png" 
              alt="MetreSurMesure Logo" 
              style={{ 
                height: '85px', // Augmenté de 40px à 60px
                width: '85px',  // Augmenté de 40px à 60px
                marginRight: '15px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                // Fallback si le logo n'est pas trouvé
                e.target.style.display = 'none';
              }}
            />
            {/* Texte avec la nouvelle couleur */}
            <span style={{ 
              color: '#F7B500', 
              fontWeight: '700', 
              fontSize: '1.8rem', // Légèrement plus grand
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              MetreSurMesure
            </span>
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ borderColor: '#FFFDE2' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/" style={{ 
                  color: '#FFFDE2',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}>
                  Accueil
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/marketplace" style={{ 
                  color: '#FFFDE2',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}>
                  Boutique
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/projects" style={{ 
                  color: '#FFFDE2',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}>
                  Projets
                </Link>
              </li>
              {user && (
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard" style={{ 
                    color: '#FFFDE2',
                    fontSize: '1.1rem',
                    fontWeight: '500'
                  }}>
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
            
            <div className="d-flex align-items-center">
              {user ? (
                <div className="position-relative">
                  <button 
                    className="btn d-flex align-items-center"
                    onClick={toggleUserMenu}
                    style={{ 
                      border: '2px solid #F7B500 ', 
                      color: '#FFFDE2 ',
                      backgroundColor: 'transparent',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: '500'
                    }}
                  >
                    <i className="fas fa-user me-2"></i>
                    {user.name}
                    <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'} ms-2`}></i>
                  </button>
                  
                  {showUserMenu && (
                    <div className="position-absolute top-100 end-0 mt-2 border rounded z-3"
                         style={{ 
                           minWidth: '200px',
                           backgroundColor: '#2c3e50',
                           borderColor: '#F7B500 !important'
                         }}>
                      <div className="p-2">
                        <Link 
                          className="dropdown-item d-block p-2 text-decoration-none"
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          style={{ color: '#FFFDE2' }}
                        >
                          <i className="fas fa-user-circle me-2"></i>Profil
                        </Link>
                        <Link 
                          className="dropdown-item d-block p-2 text-decoration-none"
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          style={{ color: '#FFFDE2' }}
                        >
                          <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                        </Link>
                        <hr className="my-1" style={{ borderColor: '#FFFDE2' }} />
                        <button 
                          className="dropdown-item d-block p-2 text-decoration-none w-100 text-start"
                          onClick={handleLogout}
                          style={{ 
                            border: 'none', 
                            background: 'none',
                            color: '#FFFDE2'
                          }}
                        >
                          <i className="fas fa-sign-out-alt me-2"></i>Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn me-2"
                    style={{ 
                      border: '2px solid #FFFDE2', 
                      color: '#FFFDE2',
                      backgroundColor: 'transparent',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: '500'
                    }}>
                    Connexion
                  </Link>
                  <Link to="/register" className="btn"
                    style={{ 
                      backgroundColor: '#F7B500', 
                      border: '2px solid #F7B500',
                      color: '#2c3e50',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: '500'
                    }}>
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        // Ajoutez ce lien dans la navigation
        {user && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin</Link>
            </li>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;