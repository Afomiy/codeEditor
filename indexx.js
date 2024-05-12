const Y=require('yjs')
const shareDB=require('sharedb')
const webSocket=require('ws')
const {applyTransformations,undo,redo}=require('./ot')
const ydoc=new Y.Doc();
const shareDBConnection=new ShareDB.Connection()
const wss=new WebSocket.Server({port:8989})
wss.on('connection',function connection(ws){
    const duplex=WebSocket.createWebSocketStream(ws)
    shareDBConnection.listen(duplex)
});
ydoc.on('update',update=>{
    const {from ,to ,ops}=update;
    const transformedOps=applyTransformations(from , to ,ops)
    ydoc.applyUpdate(transformedOps)
})
function handleUndo(){
    const undoOps=undo();
    ydoc.applyUpdate(undoOps)

}
function handleRedo() {
    const redoOps = redo();
    ydoc.applyUpdate(redoOps);
  }
