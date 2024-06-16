const Project = require('../models/Project');
const { sendInvitation } = require('../emailService');

exports.createProject = async (requestData) => {
    try {
        const projectId = generateUniqueId();
        const newProject = new Project({ projectId, code: '' });
        await newProject.save();
        const invitationLink = `http://localhost:8989/editorPage/invitation/${projectId}`;
        await sendInvitation(requestData.email, invitationLink, projectId);
        return { projectId };
    } catch (error) {
        console.error('Error creating project:', error);
        throw new Error('Failed to create project');
    }
};

exports.loadProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findOne({ projectId }).exec();
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.render('editor', { projectId, code: project.code });
    } catch (error) {
        console.error('Error loading project:', error);
        res.status(500).json({ error: 'Failed to load project' });
    }
};

exports.saveCode = async ({ code, projectId }) => {
    try {
        const project = await Project.findOne({ projectId });
        if (project) {
            project.code = code;
            await project.save();
        } else {
            throw new Error('Project not found');
        }
    } catch (error) {
        console.error('Error saving code:', error);
        throw error;
    }
};

function generateUniqueId() {
    return Math.random().toString(36).substring(7);
}
