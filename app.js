const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

const {nanoid} = require('nanoid');

const rooms = new Set();

app.set('view engine', 'ejs');
app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    const page = req.query.page || 1
    res.render('index', {
        rooms: Array.from(rooms).slice((page - 1) * 3, page * 3),
        pageCount: Math.ceil(rooms.size / 3),
        currentPage: page
    });
});

app.get('/canvas/:roomId', (req, res) => {
    if (!rooms.has(req.params.roomId)) return res.send("That room does not exist!");
    res.render('canvas', {roomId: req.params.roomId});
});

io.on('connection', (socket) => {
    /* User creates a room */
    socket.on('ROOM_CREATE', callback => {
        const roomId = nanoid(10);
        rooms.add(roomId);
        callback(roomId);
    });

    /* User joins a room */
    socket.on('ROOM_JOIN', (room) => {
        socket.join(room);
    });

    /* Handle user drawing */
    socket.on('USER_DRAW', (obj) => {
        const currentRoom = [...socket.rooms].find(room => room !== socket.id);
        socket.to(currentRoom).emit('USER_DRAW', obj);
    });

    /* Remove empty rooms on client disconnect */
    socket.on('disconnecting', () => {
        const currentRoom = [...socket.rooms].find(room => room !== socket.id);
        const roomSize = io.sockets.adapter.rooms.get(currentRoom)?.size || 0;
        if (roomSize <= 1) rooms.delete(currentRoom);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Running on port ${port}!`)
});