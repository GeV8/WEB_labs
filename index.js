const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('leave room', (room) => {
        socket.leave(room);
        console.log(`User left room: ${room}`);
    });

    socket.on('chat message', ({room, msg, username}) => {
        if (room) {
            io.to(room).emit('chat message', {username, msg});
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
