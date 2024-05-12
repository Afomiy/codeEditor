const express = require('express');
const router = express.Router();
const editorController = require('../Controllers/editorController');

router.get('/code', editorController.getCode);
router.put('/code', editorController.updateCode);
router.get('/messages', editorController.getMessages);
router.post('/messages', editorController.addMessage);
router.delete('/messages', editorController.clearMessages);

router.get('/', (req, res) => {
  const projectId=req.query.projectId
  res.render('editorPage', {projectId});
});

module.exports = router;
