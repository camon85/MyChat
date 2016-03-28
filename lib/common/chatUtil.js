/**
 * 현재 인원수
 * @param io
 * @param roomName
 * @param userCount
 */
var noticeUserCount = function(io, roomName, userCount) {
    io.to(roomName).emit('userCount', { userCount : userCount});
};

/**
 * socketId로 유저 제거
 * @param chatUsers
 * @param socketId
 * @returns {boolean}
 */
var removeBySocketId = function(chatUsers, socketId) {
    var removed = false;
    for (var i = 0; i < chatUsers.length; i++) {
        if (chatUsers[i].getSocketId() == socketId) {
            chatUsers.splice(i, 1);
            removed = true;
            break;
        }
    }
    return removed;
};

/**
 * 닉네임 찾기
 * @param chatUsers
 * @param socket
 * @returns {nick|*}
 */
var getNickBySocketId = function(chatUsers, socket) {
    var index = getIndexBySocketId(chatUsers, socket.id);
    var nick;

    if (index) { // 존재하지 않으면 socketId를 nick으로 사용
        nick = socket.id;
    } else {
        nick = chatUsers[index].getNick();
    }

    return nick;
};

/**
 * 닉네임이 존재하면 인덱스를 리턴. 존재하지 않으면 -1 리턴
 * @param chatUsers
 * @param nick
 * @returns {number}
 */
var getIndexByNick = function(chatUsers, nick) {
    var index = -1;

    for (var i = 0; i < chatUsers.length; i++) {
        if (chatUsers[i].getNick() == nick) {
            index = i;
            break;
        }
    }
    return index;
};

/**
 * 닉네임이 존재하면 인덱스를 리턴. 존재하지 않으면 -1 리턴
 * @param chatUsers
 * @param socketId
 * @returns {number}
 */
var getIndexBySocketId = function(chatUsers, socketId) {
    var index = -1;

    for (var i = 0; i < chatUsers.length; i++) {
        if (chatUsers[i].getSocketId() == socketId) {
            index = i;
            break;
        }
    }
    return index;
};

/**
 * 닉네임 변경
 * @param chatUsers
 * @param index
 * @param nick
 */
var changeNick = function(chatUsers, index, socket, nick) {
    chatUsers[index].setNick(nick);
    socket.nick = nick;
};

var showChatUsers = function(chatUsers) {
    console.log('=====showChatUsers=====');
    for (var i = 0; i < chatUsers.length; i++) {
        console.log(chatUsers[i].toString());
    }
};

module.exports.noticeUserCount = noticeUserCount;
module.exports.removeBySocketId = removeBySocketId;
module.exports.getNickBySocketId = getNickBySocketId;
module.exports.getIndexByNick = getIndexByNick;
module.exports.getIndexBySocketId = getIndexBySocketId;
module.exports.changeNick = changeNick;
module.exports.showChatUsers = showChatUsers;

