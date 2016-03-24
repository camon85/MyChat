function listen(server) {
    var userCount = 0;

    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        var roomName = 'waiting_room';

        // TODO : nick 설정
        socket.nick = socket.id;

        // room join
        socket.join(roomName);

        // 입장 알림
        io.to(roomName).emit('join', { serverMsg : '>>>' + socket.nick + '<<< 입장'});
        noticeUserCount(io, roomName, ++userCount); // 입장 시 userCount 1 증가

        // 채팅 메시지 이벤트
        socket.on('chat message', function (data) {
            data.nick = this.id;
            console.log(data);
            io.to(roomName).emit('chat message', data);
        });

        // 접속 종료 이벤트
        socket.on('disconnect', function () {
            // 퇴장 알림
            io.to(roomName).emit('disconnect', { serverMsg : '---' + socket.nick + '--- 퇴장'});
            noticeUserCount(io, roomName, --userCount); // 퇴장 시 userCount 1 감소
        });
    });
}

/**
 * 현재 인원수
 * @param io
 * @param roomName
 * @param userCount
 */
function noticeUserCount(io, roomName, userCount) {
    io.to(roomName).emit('userCount', { userCount : userCount});
}

exports.listen = listen;