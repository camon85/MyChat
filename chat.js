function listen(server) {
    var chatUsers = [];

    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        var roomName = 'waiting_room';

        // TODO : nick 설정
        socket.nick = socket.id;

        // add chatUser
        var chatUser = new ChatUser(socket.id, socket.nick);
        chatUsers.push(chatUser);

        //for (var i = 0; i < chatUsers.length; i++) {
        //    console.log(chatUsers[i].toString());
        //}


        // room join
        socket.join(roomName);

        // 입장 알림
        io.to(roomName).emit('join', { serverMsg : '>>>' + socket.nick + '<<< 입장'});
        noticeUserCount(io, roomName, chatUsers.length);

        // 유저목록 변경 알림
        io.to(roomName).emit('users', chatUsers);

        // 채팅 메시지 이벤트
        socket.on('chat message', function (data) {
            data.nick = this.id;
            console.log(data);
            io.to(roomName).emit('chat message', data);
        });

        // 접속 종료 이벤트
        socket.on('disconnect', function () {
            // remove chatUser
            removeByNick(chatUsers, socket.nick);

            // 유저목록 변경 알림
            io.to(roomName).emit('users', chatUsers);

            // 퇴장 알림
            io.to(roomName).emit('disconnect', { serverMsg : '---' + socket.nick + '--- 퇴장'});
            noticeUserCount(io, roomName, chatUsers.length);
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

/**
 * ChatUser constructor
 * @param socketId
 * @param nick
 * @constructor
 */
function ChatUser(socketId, nick) {
    this.socketId = socketId;
    this.nick = nick;
}

ChatUser.prototype.toString = function() {
    return 'socketId: ' + this.socketId + ', nick: ' + this.nick;
}

/**
 * nick으로 유저 제거
 * @param chatUsers
 * @param nick
 * @returns {boolean}
 */
function removeByNick(chatUsers, nick) {
    var removed = false;
    for (var i = 0; i < chatUsers.length; i++) {
        if (chatUsers[i].nick == nick) {
            chatUsers.splice(i, 1);
            removed = true;
            break;
        }
    }
    return removed;
}

/**
 * 닉네임 중복체크
 * @param chatUsers
 * @param nick
 * @returns {boolean}
 */
function existNick(chatUsers, nick) {
    var exist = false;
    for (var i = 0; i < chatUsers.length; i++) {
        if (chatUsers[i].nick == nick) {
            exist = true;
            break;
        }
    }
    return exist;
}

exports.listen = listen;