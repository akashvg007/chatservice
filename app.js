const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors())

const port = process.env.PORT || 5000
const USERS = [];
io.on('connection', socket => {
    const id = socket.handshake.query.id
    socket.join(id)
    console.log("id", id);
    if (!USERS.includes(id)) USERS.push(id);
    // socket.broadcast.emit('online', { id, status: 1 })
    setInterval(() => {
        USERS.forEach(user => {
            const others = USERS.filter(u => u !== user);
            socket.broadcast.to(user).emit('online', { ids: others, status: 1 })
        })
    }, 10000)
    socket.on('disconnect', (data) => {
        const user = socket.handshake.query.id;
        console.log("disconnected", data, socket.handshake.query.id);
        const index = USERS.indexOf(user)
        if (index > -1) USERS.splice(index, 1);
        socket.broadcast.emit('offline', { id: user, status: 2 })
    })
    socket.on('send-message', ({ recipient, text }) => {
        console.log("message::text", recipient, text);

        socket.broadcast.to(recipient).emit('receive-message', {
            recipient, sender: id, text
        })
    })
})

server.listen(port, () => console.log(`Server is listening on ${port}`));