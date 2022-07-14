const socket = io();

const canvas = document.getElementById('canvas');
const colorSelector = document.getElementById('colorSelector');
const ctx = canvas.getContext('2d');

const roomId = document.getElementById('roomId').value;
socket.emit('ROOM_JOIN', roomId);

let posX = posY = 0;

canvas.addEventListener('mousedown', updateCoordinates);
canvas.addEventListener('mousemove', draw);

function updateCoordinates(e) {
    posX = e.clientX - canvas.offsetLeft
    posY = e.clientY - canvas.offsetTop
}

function draw(e) {
    if (!e.buttons) return;

    ctx.beginPath();
    ctx.moveTo(posX, posY);

    const lastPosX = posX, lastPosY = posY;

    updateCoordinates(e);
    ctx.lineTo(posX, posY);
    ctx.strokeStyle = colorSelector.value;
    ctx.stroke();

    socket.emit('USER_DRAW', {
        posX: posX,
        posY: posY,
        lastPosX: lastPosX,
        lastPosY: lastPosY,
        color: colorSelector.value
    });
}

socket.on('USER_DRAW', function (obj) {
    ctx.beginPath();
    ctx.moveTo(obj.lastPosX, obj.lastPosY);
    ctx.lineTo(obj.posX, obj.posY);

    ctx.strokeStyle = obj.color;
    ctx.stroke()
});