const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController');

router.post('/create', async (req, res) => {
    try {
        // Create a new project and get the project ID
        const project = await dashboardController.createProject(req.body);
        
        // Redirect to the editor page with the project ID
        res.redirect(`/editorPage?projectId=${project.projectId}`);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});


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
module.exports = router;
