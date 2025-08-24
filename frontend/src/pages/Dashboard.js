// Frontend/src/pages/Dashboard.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../services/auth';
import { getProjects } from '../services/api';
import MapComponent from '../components/Dashboard/MapComponent';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userProjects = await getProjects();
        setProjects(userProjects);
        
        // Calculate stats
        setStats({
          total: userProjects.length,
          completed: userProjects.filter(p => p.status === 'completed').length,
          inProgress: userProjects.filter(p => p.status === 'in_progress').length,
          pending: userProjects.filter(p => p.status === 'pending').length
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  return (
    <div className="container my-5">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p className="lead">Bienvenue, {user?.name}. Voici un aperçu de vos activités.</p>
      </div>

      {/* Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3 col-6 mb-3">
          <div className="stats-card">
            <div className="stats-number">{stats.total}</div>
            <div className="stats-label">Projets total</div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="stats-card">
            <div className="stats-number">{stats.completed}</div>
            <div className="stats-label">Terminés</div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="stats-card">
            <div className="stats-number">{stats.inProgress}</div>
            <div className="stats-label">En cours</div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="stats-card">
            <div className="stats-number">{stats.pending}</div>
            <div className="stats-label">En attente</div>
          </div>
        </div>
      </div>

      {/* Projects Map */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Localisation de vos projets</h5>
            </div>
            <div className="card-body p-0">
              <MapComponent projects={projects} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Vos projets récents</h5>
              <button className="btn btn-sm btn-primary">Voir tous</button>
            </div>
            <div className="card-body">
              {projects.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nom du projet</th>
                        <th>Localisation</th>
                        <th>Statut</th>
                        <th>Date de création</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.slice(0, 5).map(project => (
                        <tr key={project.id}>
                          <td>{project.title}</td>
                          <td>{project.location}</td>
                          <td>
                            <span className={`badge ${
                              project.status === 'completed' ? 'bg-success' :
                              project.status === 'in_progress' ? 'bg-warning' : 'bg-secondary'
                            }`}>
                              {project.status === 'completed' ? 'Terminé' :
                               project.status === 'in_progress' ? 'En cours' : 'En attente'}
                            </span>
                          </td>
                          <td>{new Date(project.created_at).toLocaleDateString()}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">Détails</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                  <p>Vous n'avez aucun projet pour le moment.</p>
                  <button className="btn btn-primary">Créer un projet</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;