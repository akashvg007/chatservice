const io = require('socket.io')(5000)

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
