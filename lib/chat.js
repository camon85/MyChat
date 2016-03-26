var Message = require("./model/message.js")
var ChatUser = require("./model/chatUser.js")

function listen(server) {
    var roomName = 'waiting_room';
    var chatUsers = [];
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        // nick 최초 설정
        socket.nick = getNickBySocketId(chatUsers, socket);

        // add chatUser
        var chatUser = new ChatUser(socket.id, socket.nick);
        chatUsers.push(chatUser);

        // room join
        socket.join(roomName);

        // 입장 알림
        io.to(roomName).emit('join', { serverMsg : '>>>' + socket.nick + '<<< 입장'});
        noticeUserCount(io, roomName, chatUsers.length);

        // 유저목록 변경 알림
        io.to(roomName).emit('users', chatUsers);

        // 채팅 메시지 이벤트
        socket.on('chat message', function (data) {
            var message = new Message(socket.nick, data.message);
            io.to(roomName).emit('chat message', message);
        });

        // 닉네임 변경
        socket.on('changeNick', function (data) {
            var index = getIndexByNick(chatUsers, data.nick);

            if (index == -1) {
                index = getIndexBySocketId(chatUsers, socket.id);
                changeNick(chatUsers, index, socket, data.nick);
                data.resultMessage = 'Success';

                // 유저목록 변경 알림
                io.to(roomName).emit('users', chatUsers);

                showChatUsers(chatUsers);
            } else {
                data.resultMessage = 'Alreay exist';
            }

            socket.emit('changeNickResult', data);
        });

        // 접속 종료 이벤트
        socket.on('disconnect', function () {
            // remove chatUser
            removeBySocketId(chatUsers, socket.id);

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
 * socketId로 유저 제거
 * @param chatUsers
 * @param socketId
 * @returns {boolean}
 */
function removeBySocketId(chatUsers, socketId) {
    var removed = false;
    for (var i = 0; i < chatUsers.length; i++) {
        if (chatUsers[i].getSocketId() == socketId) {
            chatUsers.splice(i, 1);
            removed = true;
            break;
        }
    }
    return removed;
}

/**
 * 닉네임 찾기
 * @param chatUsers
 * @param socket
 * @returns {nick|*}
 */
function getNickBySocketId(chatUsers, socket) {
    var index = getIndexBySocketId(chatUsers, socket.id);
    var nick;

    if (index) { // 존재하지 않으면 socketId를 nick으로 사용
        nick = socket.id;
    } else {
        nick = chatUsers[index].getNick();
    }

    return nick;
}

/**
 * 닉네임이 존재하면 인덱스를 리턴. 존재하지 않으면 -1 리턴
 * @param chatUsers
 * @param nick
 * @returns {number}
 */
function getIndexByNick(chatUsers, nick) {
    var index = -1;

    for (var i = 0; i < chatUsers.length; i++) {
        if (chatUsers[i].getNick() == nick) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * 닉네임이 존재하면 인덱스를 리턴. 존재하지 않으면 -1 리턴
 * @param chatUsers
 * @param socketId
 * @returns {number}
 */
function getIndexBySocketId(chatUsers, socketId) {
    var index = -1;

    for (var i = 0; i < chatUsers.length; i++) {
        if (chatUsers[i].getSocketId() == socketId) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * 닉네임 변경
 * @param chatUsers
 * @param index
 * @param nick
 */
function changeNick(chatUsers, index, socket, nick) {
    chatUsers[index].setNick(nick);
    socket.nick = nick;
}

function showChatUsers(chatUsers) {
    console.log('=====showChatUsers=====');
    for (var i = 0; i < chatUsers.length; i++) {
        console.log(chatUsers[i].toString());
    }
}

exports.listen = listen;