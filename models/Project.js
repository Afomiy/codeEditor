const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    invitationLink: String,
    projectId: {
        type: String,
        required: true,
        unique: true
    }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
