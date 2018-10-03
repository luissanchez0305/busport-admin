$(document).ready(  function(){
    if(getUrlVars()['id'] != 'new'){
        $.get('/api/users.php', {type:'user', id:getUrlVars()['id']}, function(data){
            $('.page-title').html('Usuario - ' + data.user.name + ' ' + data.user.last_name);
            $('.user-id').val(data.user.id);
            $('#firstName').val(data.user.name);
            $('#lastName').val(data.user.last_name);
            $('#personalId').val(data.user.document_id);
            $('#phone').val(data.user.phone);
            $('#email').val(data.user.email);
            $('#pwd').val(data.user.password);
            $('#userType option[value="' + data.user.user_type_id + '"]').prop('selected', true);
        });
    }
    else{
        $('.page-title').html('Nuevo Usuario');
        $('#type').val('new');
    }
});