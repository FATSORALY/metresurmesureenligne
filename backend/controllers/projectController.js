// Backend/controllers/projectController.js
const db = require('../config/database');

const getProjects = async (req, res) => {
  try {
    const projects = await db.query(
      `SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(projects.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const createProject = async (req, res) => {
  const { title, description, location, latitude, longitude } = req.body;

  try {
    const newProject = await db.query(
      `INSERT INTO projects (user_id, title, description, location, location_point) 
       VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326)) 
       RETURNING *`,
      [req.user.id, title, description, location, longitude, latitude]
    );
    res.status(201).json(newProject.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await db.query(
      `SELECT * FROM projects WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    res.json(project.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProject
};