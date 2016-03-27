$(function() {
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
        $('#messages').append($('<li>').text(data.response.MESSAGE));
    });

    socket.on('users', function(data){
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<li>' + data[i].nick + '</li>';
        }
        $('#users').html(html);
    });

    socket.on('chat message', function(data){
        $('#messages').append($('<li>').text(data.nick + ': ' + data.message));
    });

    socket.on('disconnect', function(data){
        $('#messages').append($('<li>').text(data.response.MESSAGE));
    });

    socket.on('userCount', function(data){
        $('#userCount').text(data.userCount);
    });

    socket.on('changeNickResult', function(data){
        if (data.response.CODE == 1000) {
            Materialize.toast('변경되었습니다.', 4000);
        } else {
            Materialize.toast('이미 존재하는 닉네임입니다.', 4000);
        }
    });

    $('#btnChangeNick').click(function () {
        var nick = prompt('닉네임 입력');
        if (nick) {
            socket.emit('changeNick', { nick: nick });
        }
    });
});