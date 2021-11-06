const app = require("express")();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

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

server.listen(3800);