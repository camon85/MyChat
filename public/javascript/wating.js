var socket = io.connect('http://localhost:3000');

$('form').submit(function(){
    var message =  $('#m').val();

    if (message.length == 0) {
        $('#m').focus();
        return false;
    }

    socket.emit('chat message', { message: message });
    $('#m').val('');
    $('#m').focus();
    return false;
});

socket.on('join', function(data){
    console.log('join:' + data);
    $('#messages').append($('<li>').text(data.serverMsg));
});

socket.on('chat message', function(data){
    console.log('chat message:' + data);
    $('#messages').append($('<li>').text(data.nick + ': ' + data.message));
});

socket.on('disconnect', function(data){
    $('#messages').append($('<li>').text(data.serverMsg));
});