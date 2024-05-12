const Project = require('../models/Project');
const { sendInvitation } = require('../emailService');
const Code =require('../models/CodeModel')
exports.createProject = async (requestData) => {
    try {
        const projectId = generateUniqueId(); 
        const invitationLink = `http://localhost:8989/editorPage/${projectId}`;
        console.log('invitation link:',invitationLink)
        console.log(projectId);
        const newProject = new Project({
            projectId,
        });
        await newProject.save();
        await sendInvitation(requestData.email, invitationLink,projectId);
        return { projectId };
    } catch (error) {
        console.error('Error creating project:', error);
        throw new Error('Failed to create project');
    }
};
exports.saveCode=async(req,res)=>{
    try{
        const{code,projectId}=req.body
        await Code.findOneAndUpdate({projectId},{code},{upsert:true})
    res.status(200).json({message:'code saved succesfully'})
    }catch(error){
        console.error('error in saving code', error)
        res.status(500).json({error:'failed to save code'})
    }
}
function generateUniqueId() {
  
    return Math.random().toString(36).substring(7);
}
