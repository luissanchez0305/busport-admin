$(document).ready(function(){
    $('#userId').val(localStorage.getItem('current_userid'));
    $.post('/api/profile.php', { userId: localStorage.getItem('current_userid') }, function(data){
        if(data.status == 'ok'){
            $('#email').val(data.email);
            $('#username').val(data.username);
            $('#first_name').val(data.first_name);
            $('#last_name').val(data.last_name);
            $('#phone').val(data.phone);
        }
        else{
            alert(data.msg);
        }

    });
    // cambiar password
    $('body').on('click', '#change_pwd', function(){
        $.post('/api/profile.php', { userId: localStorage.getItem('current_userid'), p: $('#password').val() }, function(data){
            if(data.status == 'ok'){
                $('#change_pwd_text').html(data.msg);
            }
            else{
                $('#change_pwd_text').html('Algo sucedido. Intente mas tarde');
            }
            setTimeout(function(){ $('#change_pwd_text').html('') }, 5000);
        });
    });
});