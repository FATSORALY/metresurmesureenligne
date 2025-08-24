// Backend/routes/projects.js
const express = require('express');
const { getProjects, createProject, getProject } = require('../controllers/projectController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(auth);

router.get('/', getProjects);
router.post('/', upload.array('documents', 5), createProject);
router.get('/:id', getProject);

module.exports = router;