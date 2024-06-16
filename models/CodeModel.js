const projectSchema = new mongoose.Schema({
    projectId: { type: String, required: true },
    code: { type: String, required: true },
    username: { type: String, required: true },
    currentVersion: { type: Number, required: true },
    versions: { type: [{ versionNumber: Number, code: String, timestamp: Date }], default: [] }
});
