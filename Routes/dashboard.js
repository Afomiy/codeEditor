const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.post('/create', async (req, res) => {
    try {
        const { projectId } = await dashboardController.createProject(req.body);
        res.redirect(`/editorPage?projectId=${projectId}`);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

router.get('/load/:projectId', dashboardController.loadProject);

router.post('/save-code', async (req, res) => {
    try {
        const { code, projectId } = req.body;
        await dashboardController.saveCode({ code, projectId });
        res.status(200).json({ message: 'Code saved successfully' });
    } catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ error: 'Failed to save code' });
    }
});
router.get('/get-previous-version', async (req, res) => {
    const { projectId } = req.query;
    try {
        const project = await Project.findOne({ projectId });
        if (!project) {
            return res.status(404).send('Project not found');
        }

        const versions = project.versions;
        if (versions.length < 2) {
            return res.status(404).send('No previous versions available');
        }

        // Get the second last version
        const previousVersion = versions[versions.length - 2];

        res.json({ code: previousVersion.code, versionNumber: previousVersion.versionNumber });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/get-project', async (req, res) => {
    const { projectId } = req.query;

    try {
        const project = await Project.findOne({ projectId }).exec();
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;


