const socketIO = require('socket.io');

function configureSocket(server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        
        socket.on('codeChange', (data) => {
          
            socket.broadcast.emit('editor-changes', data);
        });

        
    });
}

module.exports = configureSocket;
