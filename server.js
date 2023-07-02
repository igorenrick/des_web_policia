const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:8080", "http://localhost:8081"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.get('/', (req, res) => {
    res.send('Servidor funcionando.');
});

server.listen(3000, () => {
    console.log('Servidor escutando na porta 3000');
});

let batalhaoId = null;

io.on('connection', (socket) => {
    console.log('Um usuário se conectou:', socket.id);

    socket.on('batalhao_connect', () => {
        batalhaoId = socket.id;
        io.emit('new_batalhao', batalhaoId);
    });

    socket.join(socket.id);

    if (batalhaoId) {
        socket.emit('new_batalhao', batalhaoId);
    }

    io.emit('new_viatura', socket.id);

    socket.on('send_message', (message) => {
        console.log('Message received:', message);
        message.sender = socket.id;

        socket.to(message.receiverId).emit('receive_message', message);
    });


    socket.on('location_update', (location) => {
        console.log('Location update from user:', socket.id, location);
        io.emit('location_update', { id: socket.id, location });
    });

    socket.on('disconnect', () => {
        console.log('Um usuário se desconectou:', socket.id);
        socket.leave(socket.id);

        io.emit('viatura_disconnected', socket.id);
    });
});