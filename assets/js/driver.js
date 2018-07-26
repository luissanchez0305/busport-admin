$(document).ready(function(){
    $('form').parsley();
    $('#expirationDate, #startDate, #finishDate').datepicker({ dateFormat: 'yyyy-mm-dd' });
    $('#expirationDate, #startDate, #finishDate').datepicker( "option", "dateFormat", 'yyyy-mm-dd' );
    if(getUrlVars()['id'] != 'new'){
        $.get('/api/drivers.php', {type:'driver', id:getUrlVars()['id']}, function(data){
            $('.page-title').html('Conductor - ' + data.driver.name + ' ' + data.driver.lastname);
            $('#driverId').val(data.driver.id);
            $('#firstName').val(data.driver.name);
            $('#lastName').val(data.driver.lastname);
            $('#nickName').val(data.driver.nickname);
            $('#personalId').val(data.driver.personal_id);
            $('#licenceNumber').val(data.driver.licencia);
            $('#expirationDate').val(data.driver.licencia_expiration);
            $('#licensePoints').val(data.driver.licencia_puntos);
            $('#startDate').val(data.driver.start_date);
            $('#finishDate').val(data.driver.finish_date);
            $('#bloodType option[value="' + data.driver.blood_type + '"]').prop('selected',true);
            $('#sizePants').val(data.driver.size_pants);
            $('#sizeShirt option[value="' + data.driver.size_shirt + '"]').prop('selected',true);
            $('#sizeShoes').val(data.driver.size_shoes);
            $('#phone').val(data.driver.contact_phone);
            $('#email').val(data.driver.email);
            $('#address').val(data.driver.address);
            $('#contactName').val(data.driver.emergency_name);
            $('#contactRelation').val(data.driver.emergency_relation);
            $('#contactPhone').val(data.driver.emergency_phone);

            for(var i = 0; i < data.items.length; i++){
                var item = data.items[i];
                $('#datatable-items').append('<tr><td>' + item.type_name + '</td><td>' + item.name + ' ' + item.last_name + '</td><td>' + item.description + '</td><td>' + item.created_date +
                    '</td></tr>');
            }

            //Buttons examples
            $('#datatable-buttons').DataTable({
                lengthChange: false,
                searching: false
            });
        });
    }
    else{
        $('.page-title').html('Nuevo Conductor');
        $('#type').val('new');
    }
});