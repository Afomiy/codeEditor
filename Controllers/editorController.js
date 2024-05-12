const editorModel = require('../models/editorModel');

module.exports = {
  getCode: function(req, res) {
    res.json(editorModel.getCode());
  },
  updateCode: function(req, res) {
    const { code } = req.body;
    editorModel.setCode(code);
    res.sendStatus(200);
  },
  getMessages: function(req, res) {
    res.json(editorModel.getMessages());
  },
  addMessage: function(req, res) {
    const { message } = req.body;
    editorModel.addMessage(message);
    res.sendStatus(200);
  },
  clearMessages: function(req, res) {
    editorModel.clearMessages();
    res.sendStatus(200);
  }
};
