$(document).ready(function(){
    $.get('/api/drivers.php', {type:'driver', id:getUrlVars()['id']}, function(data){
        $('.page-title').html(data.name + ' ' + data.lastname);
    });
});