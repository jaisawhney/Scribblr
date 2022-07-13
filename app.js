const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

app.set('views', 'static');
app.set('view engine', 'ejs');

app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    socket.on('USER_DRAW', (obj) => {
        socket.broadcast.emit('USER_DRAW', obj);
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log("Running!")
});