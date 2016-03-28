$(function() {
    // TODO 하드코딩 제거
    var socket = io.connect('http://localhost:3000');

    $('form').submit(function(){
        var message =  $('#m').val();

        if (message.length === 0) {
            $('#m').focus();
            return false;
        }

        socket.emit('chat message', { message: message });
        $('#m').val('');
        $('#m').focus();
        return false;
    });

    socket.on('join', function(data){
        renderTemplate('template_system_message', 'messages', data);
    });

    socket.on('users', function(data){
        renderTemplate('template_users', 'users', data, true);
    });

    socket.on('chat message', function(data){
        renderTemplate('template_message', 'messages', data);
    });

    socket.on('disconnect', function(data){
        renderTemplate('template_system_message', 'messages', data);
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

    /**
     * render mustache template
     * @param templateId
     * @param targetId
     * @param data
     * @param isTruncateMode
     */
    function renderTemplate(templateId, targetId, data, isTruncateMode) {
        var template = $('#' + templateId).html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);

        if (isTruncateMode) {
            $('#' + targetId).html(rendered);
        } else {
            $('#' + targetId).append(rendered);
        }
    }
});