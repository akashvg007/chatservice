const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors())

const port = process.env.PORT || 5000

io.on('connection', socket => {
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on('send-message', ({ recipient, text }) => {
        console.log("message::text", recipient, text);

        socket.broadcast.to(recipient).emit('receive-message', {
            recipient, sender: id, text
        })
    })
})

server.listen(port, () => console.log(`Server is listening on ${port}`));