const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    
    if (players.length < 2) {
        players.push(socket.id);
        socket.emit('playerNumber', players.length);
        io.emit('newPlayer', players.length);
        if (players.length === 2) {
            io.emit('startMultiplayerGame');
        }
    } else {
        socket.emit('gameFull');
    }

    socket.on('movePaddle', (data) => {
        socket.broadcast.emit('updatePaddle', data);
    });

    socket.on('serveBall', () => {
        socket.broadcast.emit('serveBall');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        players = players.filter(player => player !== socket.id);
        io.emit('playerLeft');
        if (players.length < 2) {
            io.emit('resetGame');
        }
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
