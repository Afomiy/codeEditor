const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  code: { type: String, default: '' } // Ensure code field is included with a default value
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
