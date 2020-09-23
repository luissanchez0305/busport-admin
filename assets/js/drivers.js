var drivers_dt;
$(document).ready(function(){

    $.get('/api/common.php', {type:'log-item-types'}, function(data){
        for(var j = 0; j < data.length; j++){
            var logType = data[j];
            $('#log-item-type').append('<option value='+logType.id+'>'+logType.type_name+'</option>');
        }
    });

    if(getUrlVars()['on'] == 'new'){
      console.log('new');
      $('#SavedSuccess').html('El conductor ha sido agregado con exito');
      $('#SavedSuccess').removeClass('hidden');
    }
    else if(getUrlVars()['on'] == 'edit'){
      console.log('edit');
      $('#SavedSuccess').html('El conductor ha sido editado con exito');
      $('#SavedSuccess').removeClass('hidden');
    }
    setTimeout(function(){ $('#SavedSuccess').addClass('hidden'); $('#SavedSuccess').html(''); }, 5000);

    $('body').on('click','.driver',function(){
      $this = $(this);
      /*$.get('/api/drivers.php', { type: 'driver', id: $this.attr('data-value') }, function(data){
        location.href='pages-driver.html?id='+data.id;
      });*/
      location.href='pages-driver.html?id='+$this.attr('data-value');
    });

    showAllDrivers();

    $('#showAllDrivers').click(function(){
      showAllDrivers();
    });
    $('body').on('click', '.btn.activedriver', function(e){
        e.preventDefault();
        var $this = $(this);
        if(!$this.hasClass('active')){
            var status_pressed = $this.find('input').val();
            $.get('/api/drivers.php', {type: 'drivers-status', action: status_pressed }, function(data){
                toggleActiveStatus($this);
                $('#drivers').html('');
                displayTableResult(data);
            });
        }
        else if($('#driverId').val() == 'id'){
            toggleActiveStatus($this);
        }
    });

});

function showAllDrivers(){
    $.get('/api/drivers.php', { type: 'all' }, function(data){
        $('#showAllDrivers').addClass('hidden');
        $('#drivers').html('');
        displayTableResult(data);
        drivers_dt = $('#tech-companies-1').DataTable({
          lengthChange: false,
          searching: false,
          //order:[[ 4, "desc" ]],
          dom: 'Bfrtip',
          buttons: [
            'csv', 'excel'
          ],
          'columns': [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
            { "visible": false },
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
    if(array.driver){
        $('#drivers').append('<tr class="driver" data-value="'+array.driver.id+'">'+
        '<th><span class="co-name">' + array.driver.name + ' ' + array.driver.lastname + '</span></th>'+
        '<td>' + array.driver.personal_id + '</td>'+
        '<td>' + array.driver.blood_type + '</td>'+
        '<td>' + array.driver.contact_phone + '</td>'+
        '<td>' + (array.driver.start_date ? array.driver.start_date : '') + '</td>'+
        '<td>' + (array.driver.finish_date ? array.driver.finish_date : '') + '</td>'+
        '<td>' + (array.driver.finish_date ? 'No' : 'Si') + '</td>'+
        '<td style="display:none;">' + array.driver.licencia + '</td>'+
        '<td style="display:none;">' + array.driver.licencia_expiration + '</td>'+
        '<td style="display:none;">' + array.driver.address + '</td>'+
        '<td style="display:none;">' + array.driver.licencia_puntos + '</td>'+
        '<td style="display:none;">' + array.driver.size_pants + '</td>'+
        '<td style="display:none;">' + array.driver.size_shirt + '</td>'+
        '<td style="display:none;">' + array.driver.size_shoes + '</td>'+
        '<td style="display:none;">' + array.driver.email + '</td>'+
        '<td style="display:none;">' + array.driver.emergency_name + '</td>'+
        '<td style="display:none;">' + array.driver.emergency_phone + '</td>'+
        '<td style="display:none;">' + array.driver.emergency_name2 + '</td>'+
        '<td style="display:none;">' + array.driver.emergency_phone2 + '</td>'+
        '<td style="display:none;">' + array.driver.base_bonus + '</td>'+
        '<td style="display:none;">' + array.driver.month_bonus + '</td>'+
        '<td style="display:none;">' + array.driver.special_bonus + '</td>'+
        '</tr>');
    }
    else {
      $.each(array, function (i,item){
          $('#drivers').append('<tr class="driver" data-value="'+item.driver.id+'">'+
          '<th><span class="co-name">' + item.driver.name + ' ' + item.driver.lastname + '</span></th>'+
          '<td>' + item.driver.personal_id + '</td>'+
          '<td>' + item.driver.blood_type + '</td>'+
          '<td>' + item.driver.contact_phone+ '</td>'+
          '<td>' + (item.driver.start_date ? item.driver.start_date : '') + '</td>'+
          '<td>' + (item.driver.finish_date ? item.driver.finish_date : '') + '</td>'+
          '<td>' + (item.driver.finish_date ? 'No' : 'Si') + '</td>'+           
          '<td>' + item.driver.licencia + '</td>'+
          '<td>' + item.driver.licencia_expiration + '</td>'+
          '<td>' + item.driver.address + '</td>'+
          '<td>' + item.driver.licencia_puntos + '</td>'+
          '<td>' + item.driver.size_pants + '</td>'+
          '<td>' + item.driver.size_shirt + '</td>'+
          '<td>' + item.driver.size_shoes + '</td>'+
          '<td>' + item.driver.email + '</td>'+
          '<td>' + item.driver.emergency_name + '</td>'+
          '<td>' + item.driver.emergency_phone + '</td>'+
          '<td>' + item.driver.emergency_name2 + '</td>'+
          '<td>' + item.driver.emergency_phone2 + '</td>'+
          '<td>' + item.driver.base_bonus + '</td>'+
          '<td>' + item.driver.month_bonus + '</td>'+
          '<td>' + item.driver.special_bonus + '</td>'+
          '</tr>');
      });
    }
}
