// Frontend/src/pages/Projects.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../services/auth';
import { getProjects, createProject } from '../services/api';
import MapComponent from '../components/Dashboard/MapComponent';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: ''
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const userProjects = await getProjects();
      setProjects(userProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        latitude: '',
        longitude: ''
      });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: '#ecf0f1 ',}}>Mes Projets</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Nouveau Projet
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Créer un nouveau projet</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Titre</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Localisation</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    className="form-control"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    className="form-control"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">Créer</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {projects.map(project => (
          <div key={project.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card project-card">
              <div 
                className="project-image"
                style={{ 
                  backgroundImage: `url(https://via.placeholder.com/300x200?text=${encodeURIComponent(project.title)}` 
                }}
              />
              <div className="project-content">
                <h5 className="project-title">{project.title}</h5>
                <p className="project-location">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {project.location}
                </p>
                <p>{project.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className={`badge ${
                    project.status === 'completed' ? 'bg-success' :
                    project.status === 'in_progress' ? 'bg-warning' : 'bg-secondary'
                  }`}>
                    {project.status === 'completed' ? 'Terminé' :
                     project.status === 'in_progress' ? 'En cours' : 'En attente'}
                  </span>
                  <button className="btn btn-sm btn-outline-primary">
                    Détails
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;