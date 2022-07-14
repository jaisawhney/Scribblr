const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

const {nanoid} = require('nanoid');

const rooms = new Set();

//app.set('views', 'static');
app.set('view engine', 'ejs');

app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/canvas/:roomId', (req, res) => {
    //console.log(io.sockets.adapter.rooms);
    if (!rooms.has(req.params.roomId)) return res.send("That room does not exist!");
    res.render('canvas', {roomId: req.params.roomId});
});

io.on('connection', (socket) => {
    socket.on('ROOM_CREATE', callback => {
        const roomId = nanoid(10);
        rooms.add(roomId);
        callback(roomId);
    });

    socket.on('ROOM_JOIN', (room) => {
        socket.join(room);
    });

    socket.on('USER_DRAW', (obj) => {
        const currentRoom = [...socket.rooms].find(room => room !== socket.id);
        socket.to(currentRoom).emit('USER_DRAW', obj);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Running on port ${port}!`)
});