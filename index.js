require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const db = require('./db');
const Project=require('./models/Project')
const dashboardRouter = require('./Routes/dashboard');
const editorRouter = require('./Routes/editorRouter');
const { sendInvitation } = require('./emailService');
const userRouter = require('./Routes/userRoutes');
const configureSocket = require('./socket');
const Code = require('./models/CodeModel');
const dashboardController=require('./Controllers/dashboardController')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/dashboard', dashboardRouter);
app.use('/editorPage', editorRouter);
app.use('/', userRouter);
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
// Assuming you are using Express
app.get('/get-project', (req, res) => {
  const projectId = req.query.projectId;
  // Use projectId to fetch project data from your database or any other source
  // Example:
  Project.findOne({ _id: projectId })
    .then(project => {
      if (project) {
        res.json({ code: project.code }); // Respond with project data
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

function generateUniqueId() {
  return Math.random().toString(36).substring(7);
}

app.get('/editorPage', (req, res) => {
    res.render('editorPage');
});

app.get('/editorPage/invitation/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  res.redirect(`/editorPage?projectId=${projectId}`);
});
app.post('/create', async (req, res) => {
  try {
      const projectId = generateUniqueId(); // Generate project ID
     
      res.json({ projectId });
  } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/send-invitation', (req, res) => {
    const { email, projectId } = req.body;
    const invitationLink = `http://localhost:8989/editorPage/invitation/${projectId}`;
    sendInvitation(email, invitationLink,projectId); // Make sure to pass invitationLink here
    res.sendStatus(200);
});

io.on('connection', (socket) => {
    console.log('Client connected');

   
    socket.on('undo', () => {
        socket.broadcast.emit('undo');
    });

    
    socket.on('redo', () => {
        socket.broadcast.emit('redo');
    });

    
    socket.on('save', async (code) => {
        try {
            const savedCode = await Code.create({ code });
            socket.emit('saveSuccess', savedCode);
        } catch (error) {
            socket.emit('saveError', { message: 'Failed to save code.' });
        }
    });

    // Handle socket disconnections
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


app.post('/save-code', async (req, res) => {
    try {
        const { code } = req.body;
        const newCode = new Code({ code });
        await newCode.save();
        res.json({ message: 'Code saved successfully' });
    } catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

server.listen(8989, () => {
    console.log('Server is running');
});
