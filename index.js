require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cors = require('cors'); // Import the cors package
const app = express();
const User = require('./models/User')
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const connectToDatabase = require('./db');
const Project = require('./models/Project');
const dashboardRouter = require('./Routes/dashboard');
const editorRouter = require('./Routes/editorRouter');
const { sendInvitation } = require('./emailService');
const userRouter = require('./Routes/userRoutes');
const { generateUniqueId } = require('./utils');
const dashboardController = require('./Controllers/dashboardController');

connectToDatabase();

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/dashboard', dashboardRouter);
app.use('/editorPage', editorRouter);
app.use('/', userRouter);
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email, password }, (err, user) => {
        if (user) {
            req.session.userId = user._id;
            res.redirect('/dashboard');
        } else {
            res.redirect('/login');
        }
    });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const { email, username, password } = req.body;
    const newUser = new User({ email, username, password });
    newUser.save((err) => {
        if (err) {
            res.redirect('/signup');
        } else {
            req.session.userId = newUser._id;
            res.redirect('/dashboard');
        }
    });
});

app.get('/dashboard', (req, res) => {
   resrender('dashboard');
    } )

app.get('/get-project', async (req, res) => {
    try {
        const { projectId } = req.query;
        const project = await Project.findOne({ projectId }).exec();

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/save-project', async (req, res) => {
    const { projectId, code } = req.body;

    try {
        let project = await Project.findOne({ projectId });
        console.log('Retrieved project:', project); // Add this line for logging

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const newVersionNumber = project.currentVersion + 1;

        // Check if the versions array is properly initialized
        if (!project.versions) {
            project.versions = [];
        }

        project.versions.push({
            versionNumber: newVersionNumber,
            code: project.currentCode,
            timestamp: new Date()
        });

        project.currentCode = code;
        project.currentVersion = newVersionNumber;

        await project.save();
        io.to(projectId).emit('codeSaved', { code, versionNumber: newVersionNumber });
        res.status(200).json({ message: 'Code saved successfully' });
    } catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ message: 'Error saving code', error });
    }
});


app.post('/go-to-project', async (req, res) => {
    const { username, projectId } = req.body;

    try {
        const project = await Project.findOne({ projectId });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const redirectUrl = `/editorPage?projectId=${projectId}&username=${username}`;
        res.status(200).json({ redirectUrl });
    } catch (error) {
        console.error('Error finding project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/join-project', (req, res) => {
    const { username, projectLink } = req.body;
    const projectId = projectLink.split('/').pop();
    const redirectUrl = `/editorPage?projectId=${projectId}&username=${username}&isCreator=false`;
    res.status(200).json({ redirectUrl });
});


app.get('/get-previous-version', async (req, res) => {
    const { projectId } = req.query;

    try {
        const project = await Project.findOne({ projectId });
        console.log('Retrieved project:', project); // Log the retrieved project

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        console.log('Project versions:', project.versions); // Log the versions array

        if (!project.versions || project.versions.length < 2) {
            return res.status(400).json({ message: 'No previous versions available' });
        }

        console.log('Versions length:', project.versions.length); // Log the length of versions array

        // Pop the last two versions to get the previous version
        project.currentCode = project.versions[project.versions.length - 2].code;
        await project.save();

        io.to(projectId).emit('editorUpdate', { content: project.currentCode });
        res.status(200).json({ code: project.currentCode, versionNumber: project.currentVersion - 1 });
    } catch (error) {
        res.status(500).json({ message: 'Error reverting code', error });
    }
});

app.post('/create-project', async (req, res) => {
    const { username } = req.body;
    const projectId = generateUniqueId();

    try {
        const newProject = new Project({
            projectId,
            code: '', // Initialize with empty code
            username,
            currentVersion: 0,
            versions: []
        });

        await newProject.save();

        res.status(201).json({ projectId });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).send('Error creating project');
    }
});





app.get('/editorPage/invitation/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    res.redirect(`/editorPage?projectId=${projectId}&isCreator=false`);
});

app.get('/editorPage', (req, res) => {
    const { projectId, isCreator } = req.query;
    res.render('editorPage', { projectId, isCreator });
});

app.post('/send-invitation', (req, res) => {
    const { recipientEmail, projectId } = req.body;

    if (!recipientEmail) { // Change from email to recipientEmail
        return res.status(400).json({ error: 'Email address is required' });
    }

    const invitationLink = `http://localhost:8999/dashboard?invitationLink=http://localhost:8999/editorPage/invitation/${projectId}`;

    sendInvitation(recipientEmail, invitationLink, projectId);
    res.send({ message: 'Invitation sent successfully' });
});

app.get('/get-invitation-link', (req, res) => {
    const { projectId } = req.query;
    const invitationLink = `http://localhost:8999/editorPage/invitation/${projectId}`;
    res.send({ invitationLink });
});

const projectUsers = {};
const connectedUsers = {};
const projects = {};

function updateConnectedUsers(projectId) {
    const users = projectUsers[projectId] || [];
    io.to(projectId).emit('connectedUsers', users);
}
app.post('/delete-user', async (req, res) => {
    const { projectId, username } = req.body;

    try {
        // Your logic to delete the user from the project
        // For example:
         const project = await Project.findOneAndUpdate({ projectId }, { $pull: { users: username } });

        io.to(projectId).emit('userDeleted', username); // Emit event to inform connected clients
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', ({ projectId, username }) => {
        console.log(`User ${username} joined project ${projectId}`);
        socket.join(projectId);

        if (!projectUsers[projectId]) {
            projectUsers[projectId] = [];
        }
        projectUsers[projectId].push(username);

        socket.projectId = projectId;
        socket.username = username;

        updateConnectedUsers(projectId);

        socket.on('editorChange', async ({ content, projectId }) => {
            try {
                console.log(`Received editorChange for project ${projectId}:`, content);
                await Project.findOneAndUpdate({ projectId }, { code: content });
                io.to(projectId).emit('editorUpdate', { content });
            } catch (err) {
                console.error('Error updating code:', err);
            }
        });
// Handle the revert code event
socket.on('revertCode', async ({ projectId, versionNumber }) => {
    try {
        let project = await Project.findOne({ projectId });

        if (!project || !project.versions || project.versions.length < 2) {
            return socket.emit('noPreviousVersions');
        }

        let versionToRevert;
        if (versionNumber !== undefined) {
            versionToRevert = project.versions.find(v => v.versionNumber === versionNumber);
        } else {
            versionToRevert = project.versions[project.versions.length - 2];
        }

        if (versionToRevert) {
            project.code = versionToRevert.code;
            project.currentVersion = versionToRevert.versionNumber;
            await project.save();

            io.to(projectId).emit('editorUpdate', { content: project.code });
            socket.emit('codeReverted', { code: project.code, versionNumber: versionToRevert.versionNumber });
        }
    } catch (err) {
        console.error('Error reverting code:', err);
    }
});


        socket.on('saveCode', async ({ projectId, code }) => {
            try {
                let project = await Project.findOne({ projectId });

                if (!project) {
                    return;
                }

                if (!project.versions) {
                    project.versions = [];
                }

                const newVersionNumber = project.currentVersion + 1;

                project.versions.push({
                    versionNumber: newVersionNumber,
                    code: code,
                    timestamp: new Date()
                });

                project.currentVersion = newVersionNumber;

                await project.save();

                io.to(projectId).emit('codeSaved', { code, versionNumber: newVersionNumber });
            } catch (error) {
                console.error('Error saving code:', error);
            }
        });

        socket.on('chatMessage', ({ message }) => {
            io.to(socket.projectId).emit('chatMessage', message);
        });

        
        

        socket.on('deleteProject', async ({ projectId }) => {
            try {
                console.log(`Received delete project request for project ${projectId}`);
                await Project.deleteOne({ projectId });
                console.log(`Project ${projectId} deleted successfully`);
                io.to(projectId).emit('projectDeleted');
            } catch (err) {
                console.error('Error deleting project:', err);
            }
        });

       // Inside the socket.on('deleteUser', ...) event handler
// Inside the socket.on('deleteUser', ...) event handler
// Delete user
socket.on('deleteUser', (usernameToDelete) => {
    if (usernameToDelete === username) {
        // If the current user is the one being deleted, emit an alert event to inform them
        socket.emit('alert', { message: 'You have been deleted by admin.' });
        // Disconnect the current user
        socket.disconnect();
    } else {
        // Remove the user from the connectedUsers list
        const index = connectedUsers.findIndex(user => user.username === usernameToDelete);
        if (index !== -1) {
            connectedUsers.splice(index, 1);
            // Emit an event to update the list of connected users for all clients
            io.to(projectId).emit('updateConnectedUsers', connectedUsers);
            // Emit an event to inform other users about the deletion
            io.to(projectId).emit('alert', { message: `${usernameToDelete} has been deleted by admin.` });
        }
    }
    // Redirect the deleted user to the dashboard
    io.to(usernameToDelete).emit('redirect', '/dashboard');
});

    })

        socket.on('disconnect', () => {
            console.log('A user disconnected');
            const { projectId, username } = socket;
            if (projectId && username && projectUsers[projectId]) {
                projectUsers[projectId] = projectUsers[projectId].filter(user => user !== username);

                if (projectUsers[projectId].length === 0) {
                    delete projectUsers[projectId];
                } else {
                    updateConnectedUsers(projectId);
                }
            }
        });
    })


const PORT = process.env.PORT || 8999;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
