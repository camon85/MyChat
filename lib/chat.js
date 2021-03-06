function listen(server) {
    var Message = require("./model/message");
    var ChatUser = require("./model/chatUser");
    var chatUtil = require("./common/chatUtil");
    var roomName = 'waiting_room';
    var chatUsers = [];
    var io = require('socket.io')(server);
    var messageUtil = require('./common/messageUtil');

    io.on('connection', function (socket) {
        // nick 최초 설정
        socket.nick = chatUtil.getNickBySocketId(chatUsers, socket);

        // add chatUser
        var chatUser = new ChatUser(socket.id, socket.nick);
        chatUsers.push(chatUser);

        // room join
        socket.join(roomName);

        // 입장 알림
        var responseData = {
            response: messageUtil.get('JOIN', chatUser.getNick())
        };
        io.to(roomName).emit('join', responseData);
        chatUtil.noticeUserCount(io, roomName, chatUsers.length);

        emitUserList(roomName, chatUsers);

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
                data.response = messageUtil.get('SUCCESS');

                emitUserList(roomName, chatUsers);

                chatUtil.showChatUsers(chatUsers);
            } else {
                data.response = messageUtil.get('DUPLICATED_NICK');
            }

            socket.emit('changeNickResult', data);
        });

        // 접속 종료 이벤트
        socket.on('disconnect', function () {
            // remove chatUser
            chatUtil.removeBySocketId(chatUsers, socket.id);

            emitUserList(roomName, chatUsers);

            // 퇴장 알림
            var responseData = {
                response: messageUtil.get('LEAVE', chatUser.getNick())
            };
            io.to(roomName).emit('disconnect', responseData);
            chatUtil.noticeUserCount(io, roomName, chatUsers.length);
        });
    });

    /**
     * 유저목록 변경 알림
     * @param roomName
     * @param eventName
     * @param chatUsers
     */
    function emitUserList(roomName, chatUsers) {
        io.to(roomName).emit('users', { users: chatUsers });
    }
}


exports.listen = listen;