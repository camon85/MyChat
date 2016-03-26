var Message = function (nick, message) {
    this.nick = nick;
    this.message = message;
    this.date = new Date();
}

module.exports = Message;