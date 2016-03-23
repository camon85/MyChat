function listen(server) {
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        var roomName = 'room1'; // TODO room 하드코딩 수정
        socket.nick = socket.id; // TODO : nick 설정
        socket.join(roomName);

        io.to(roomName).emit('join', { serverMsg : '>>>' + socket.nick + '<<< 입장'});

        socket.on('chat message', function (data) {
            data.nick = this.id;
            console.log(data);
            io.to(roomName).emit('chat message', data);
        });

        socket.on('disconnect', function () {
            io.to(roomName).emit('disconnect', { serverMsg : '---' + socket.nick + '--- 퇴장'});
        });
    });
}


exports.listen = listen;