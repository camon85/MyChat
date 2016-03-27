var systemMessage = require('../../config/systemMessage.json');

var get = function(key) {
    var argumentsLength = arguments.length;
    var message = systemMessage[key];

    for (var i = 1; i < argumentsLength; i++) {
        message.MESSAGE = message.MESSAGE.replace('{{' + i + '}}', arguments[i]);
    }

    return message;
}

exports.get = get;