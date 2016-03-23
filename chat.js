function listen(server) {
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });

        socket.on('chat message', function (data) {
            console.log(data);
            socket.emit('chat message', data);
        });
    });
}


exports.listen = listen;