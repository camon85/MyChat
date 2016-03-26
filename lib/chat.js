function listen(server) {
    var Message = require("./model/message.js")
    var ChatUser = require("./model/chatUser2.js")
    var chatUtil = require("./chatUtil.js")
    var roomName = 'waiting_room';
    var chatUsers = [];
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        // nick 최초 설정
        socket.nick = chatUtil.getNickBySocketId(chatUsers, socket);

        // add chatUser
        var chatUser = new ChatUser(socket.id, socket.nick);
        chatUsers.push(chatUser);

        // room join
        socket.join(roomName);

        // 입장 알림
        io.to(roomName).emit('join', { serverMsg : '>>>' + socket.nick + '<<< 입장'});
        chatUtil.noticeUserCount(io, roomName, chatUsers.length);

        // 유저목록 변경 알림
        io.to(roomName).emit('users', chatUsers);

        // 채팅 메시지 이벤트
        socket.on('chat message', function (data) {
            var message = new Message(socket.nick, data.message);
            io.to(roomName).emit('chat message', message);
        });

        // 닉네임 변경
        socket.on('changeNick', function (data) {
            var index = chatUtil.getIndexByNick(chatUsers, data.nick);

            if (index == -1) {
                index = chatUtil.getIndexBySocketId(chatUsers, socket.id);
                chatUtil.changeNick(chatUsers, index, socket, data.nick);
                data.resultMessage = 'Success';

                // 유저목록 변경 알림
                io.to(roomName).emit('users', chatUsers);

                chatUtil.showChatUsers(chatUsers);
            } else {
                data.resultMessage = 'Alreay exist';
            }

            socket.emit('changeNickResult', data);
        });

        // 접속 종료 이벤트
        socket.on('disconnect', function () {
            // remove chatUser
            chatUtil.removeBySocketId(chatUsers, socket.id);

            // 유저목록 변경 알림
            io.to(roomName).emit('users', chatUsers);

            // 퇴장 알림
            io.to(roomName).emit('disconnect', { serverMsg : '---' + socket.nick + '--- 퇴장'});
            chatUtil.noticeUserCount(io, roomName, chatUsers.length);
        });
    });
}


exports.listen = listen;