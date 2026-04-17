const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

let players = [];
const eventWindows = new Map();

const MOVE_PADDLE_WINDOW_MS = 50;
const MOVE_PADDLE_LIMIT = 1;
const SERVE_BALL_WINDOW_MS = 1000;
const SERVE_BALL_LIMIT = 1;

function createEventLimiter(socketId, eventName, limit, windowMs) {
    const key = `${socketId}:${eventName}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    const timestamps = (eventWindows.get(key) || []).filter((timestamp) => timestamp > windowStart);

    if (timestamps.length >= limit) {
        eventWindows.set(key, timestamps);
        return false;
    }

    timestamps.push(now);
    eventWindows.set(key, timestamps);
    return true;
}

function isValidMovePaddlePayload(payload, playerNumber) {
    return (
        payload &&
        payload.player === playerNumber &&
        payload.position &&
        Number.isFinite(payload.position.x) &&
        Number.isFinite(payload.position.z)
    );
}

function sanitizeMovePaddlePayload(payload, playerNumber) {
    return {
        player: playerNumber,
        position: {
            x: payload.position.x,
            z: payload.position.z,
        },
    };
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.data.playerNumber = null;
    
    if (players.length < 2) {
        players.push(socket.id);
        socket.data.playerNumber = players.length;
        socket.emit('playerNumber', socket.data.playerNumber);
        io.emit('newPlayer', socket.data.playerNumber);
        if (players.length === 2) {
            io.emit('startMultiplayerGame');
        }
    } else {
        socket.emit('gameFull');
    }

    socket.on('movePaddle', (data) => {
        if (!socket.data.playerNumber || !isValidMovePaddlePayload(data, socket.data.playerNumber)) {
            return;
        }

        if (!createEventLimiter(socket.id, 'movePaddle', MOVE_PADDLE_LIMIT, MOVE_PADDLE_WINDOW_MS)) {
            return;
        }

        socket.broadcast.emit('updatePaddle', sanitizeMovePaddlePayload(data, socket.data.playerNumber));
    });

    socket.on('serveBall', () => {
        if (!socket.data.playerNumber) {
            return;
        }

        if (!createEventLimiter(socket.id, 'serveBall', SERVE_BALL_LIMIT, SERVE_BALL_WINDOW_MS)) {
            return;
        }

        socket.broadcast.emit('serveBall');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        players = players.filter(player => player !== socket.id);
        eventWindows.delete(`${socket.id}:movePaddle`);
        eventWindows.delete(`${socket.id}:serveBall`);
        io.emit('playerLeft');
        if (players.length < 2) {
            io.emit('resetGame');
        }
    });
});

server.listen(PORT, () => {
    const address = server.address();
    const listeningPort = address && typeof address === 'object' ? address.port : PORT;
    console.log(`listening on *:${listeningPort}`);
});
