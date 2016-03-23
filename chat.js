function listen(server) {
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        var roomName = 'room1';

        socket.join(roomName);

        io.to(roomName).emit('join:' + socket.id);

        socket.on('chat message', function (data) {
            console.log(data);
            io.to(roomName).emit('chat message', data);
        });
    });
}


exports.listen = listen;