const express = require('express');
const router = express.Router();
const editorController = require('../controllers/editorController');
const { isObjectIdOrHexString } = require('mongoose');

router.get('/code', editorController.getCode);
router.put('/code', editorController.updateCode);
router.get('/messages', editorController.getMessages);
router.post('/messages', editorController.addMessage);
router.delete('/messages', editorController.clearMessages);

router.get('/', (req, res) => {
  const projectId=req.query.projectId
  res.render('editorPage', {projectId});
});
router.post('./codeChange',(req,res)=>{
  const codeChangeData=req.body
  io.emit('codeChangeData')
  res.send('code change broadcasted successfully')
})

module.exports = router;
