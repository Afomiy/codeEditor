const Project = require('../models/Project');
const mongoose=require('mongoose')
exports.loadProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        let project = await Project.findOne({ projectId });
        if (!project) {
            project = new Project({ projectId, code: '' });
            await project.save();
        }
        res.render('editor', { projectId, code: project.code });
    } catch (err) {
        res.status(500).send('Error loading project: ' + err.message);
    }
};

