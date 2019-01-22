var users_dt;

$(document).ready(function(){
    $.get('/api/common.php', {type:'log-item-types'}, function(data){
        for(var j = 0; j < data.length; j++){
            var logType = data[j];
            $('#log-item-type').append('<option value='+logType.id+'>'+logType.type_name+'</option>');
        }
    });

    /*if(getUrlVars()['on'] == 'new'){
      console.log('new');
      $('#SavedSuccess').html('El conductor ha sido agregado con exito');
      $('#SavedSuccess').removeClass('hidden');
    }
    else if(getUrlVars()['on'] == 'edit'){
      console.log('edit');
      $('#SavedSuccess').html('El conductor ha sido editado con exito');
      $('#SavedSuccess').removeClass('hidden');
    }
    setTimeout(function(){ $('#SavedSuccess').addClass('hidden'); $('#SavedSuccess').html(''); }, 5000);*/

    $('body').on('click','.user',function(){
      $this = $(this);
      /*$.get('/api/drivers.php', { type: 'driver', id: $this.attr('data-value') }, function(data){
        location.href='pages-driver.html?id='+data.id;
      });*/
      location.href='pages-user.html?id='+$this.attr('data-value');
    });

    showAllUsers();

    $('#showAllUsers').click(function(){
      showAllUsers();
    });

    $('body').on('click','.delete-user', function(e){
        e.preventDefault();
        if(confirm('Esta seguro?\nTodos los conductores creados por este usuario seran reasinados al usuario por defecto')){
          var $this_row = $(this).parents('tr')
          $.get('/api/users.php', { type: 'delete', userId : $this_row.attr('data-value') }, function(){
            users_dt.row( $this_row )
                .remove()
                .draw();
          });
        }
        return false;
    });
});

function showAllUsers(){
    $.get('/api/users.php', { type: 'all' }, function(data){
        $('#showAllDrivers').addClass('hidden');
        $('#drivers').html('');
        displayTableResult(data);
        users_dt = $('#tech-companies-1').DataTable({
          lengthChange: false,
          searching: false,
          //order:[[ 4, "desc" ]],
          dom: 'Bfrtip',
          buttons: [
            'csv', 'excel'
          ]
        });
        $('#status').fadeOut();
        $('#preloader').delay(350).fadeOut('slow');
        $('body').delay(350).css({
            'overflow': 'visible'
        });
    });
}

function displayTableResult(array){
    if(array.user){
        $('#users').append('<tr class="user" data-value="'+array.user.id+'"><th><span class="co-name">' + array.user.name + ' ' + array.user.last_name + '</span></th><td>' + array.user.email + '</td><td>' + array.user.username + '</td><td>' + array.user.password+ '</td><td>' + (array.user.user_type_id == 1 ? 'admin' : 'supervisor') +'</td><td>' + array.user.phone + '</td><td data-toggle="buttons"><label class="btn btn-warning delete-user">Borrar</label></td></tr>');
    }
    else {
      $.each(array, function (i,item){
          $('#users').append('<tr class="user" data-value="'+item.user.id+'"><th><span class="co-name">' + item.user.name + ' ' + item.user.last_name + '</span></th><td>' + item.user.email + '</td><td>' + item.user.username + '</td><td>' + item.user.password+ '</td><td>' + (item.user.user_type_id == 1 ? 'admin' : 'supervisor') +'</td><td>' + item.user.phone + '</td><td data-toggle="buttons"><label class="btn btn-warning delete-user">Borrar</label></td></tr>');
      });
    }
}
