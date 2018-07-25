$(document).ready(function(){
    $('form').parsley();
    $('#expirationDate, #startDate, #finishDate').datepicker({ dateFormat: 'yyyy-mm-dd' });
    $('#expirationDate, #startDate, #finishDate').datepicker( "option", "dateFormat", 'yyyy-mm-dd' );
    if(getUrlVars()['id'] != 'new'){
        $.get('/api/drivers.php', {type:'driver', id:getUrlVars()['id']}, function(data){
            $('.page-title').html('Conductor - ' + data.name + ' ' + data.lastname);
            $('#driverId').val(data.id);
            $('#firstName').val(data.name);
            $('#lastName').val(data.lastname);
            $('#nickName').val(data.nickname);
            $('#personalId').val(data.personal_id);
            $('#licenceNumber').val(data.licencia);
            $('#expirationDate').val(data.licencia_expiration);
            $('#licensePoints').val(data.licencia_puntos);
            $('#startDate').val(data.start_date);
            $('#finishDate').val(data.finish_date);
            $('#bloodType option[value="' + data.blood_type + '"]').prop('selected',true);
            $('#sizePants').val(data.size_pants);
            $('#sizeShirt option[value="' + data.size_shirt + '"]').prop('selected',true);
            $('#sizeShoes').val(data.size_shoes);
            $('#phone').val(data.contact_phone);
            $('#email').val(data.email);
            $('#address').val(data.address);
            $('#contactName').val(data.emergency_name);
            $('#contactRelation').val(data.emergency_relation);
            $('#contactPhone').val(data.emergency_phone);
        });
    }
    else{
        $('.page-title').html('Nuevo Conductor');
        $('#type').val('new');
    }
});