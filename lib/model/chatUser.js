// 생성자
var ChatUser = function(socketId, nick) {
    this.socketId = socketId;
    this.nick = nick;
};

ChatUser.prototype.toString = function() {
    return 'socketId: ' + this.socketId + ', nick: ' + this.nick;
};

ChatUser.prototype.getSocketId = function() {
    return this.socketId;
};

ChatUser.prototype.getNick = function() {
    return this.nick;
};

ChatUser.prototype.setNick = function(nick) {
    this.nick = nick;
};

module.exports = ChatUser;