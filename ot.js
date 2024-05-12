const ot=require('ot')
const server=new ot .Server('')
const client =new ot.Client(0,[]);
function applyTransformations(from,to,ops){
    const transformedOps=client.receiveOperation(from,to,ops)
    return transformedOps;
}
function undo(){
    const undoOps=client.undo()
    return undoOps;
}
function redo(){
    const redoOps=client.redo()
    return redoOps
}
module.exports={applyTransformations,undo,redo}