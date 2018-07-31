$(document).ready(function(){
    var dt;
    $('form').parsley();
    $('#expirationDate, #startDate, #finishDate').datepicker({ dateFormat: 'yyyy-mm-dd' });
    $('#expirationDate, #startDate, #finishDate').datepicker( "option", "dateFormat", 'yyyy-mm-dd' );
    if(getUrlVars()['id'] != 'new'){
        $.get('/api/drivers.php', {type:'driver', id:getUrlVars()['id']}, function(data){
            $('.page-title').html('Conductor - ' + data.driver.name + ' ' + data.driver.lastname);
            $('.driver-id').val(data.driver.id);
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

            for(var j = 0; j < data.logTypes.length; j++){
                var logType = data.logTypes[j];
                $('#log-item-type').append('<option value='+logType.id+'>'+logType.type_name+'</option>');
            }
            for(var k = 0; k < data.fileTypes.length; k++){
                var fileType = data.fileTypes[k];
                $('#file-item-type').append('<option value='+fileType.id+'>'+fileType.name+'</option>');
            }

            dt = loadLogsTable(data.items);
        });
    }
    else{
        $('.page-title').html('Nuevo Conductor');
        $('#type').val('new');
        $('.log-section').addClass('hidden');
    }
    $('body').on('click', '#addFileButton', function(){
        $('#file-item-type option:eq(0)').prop('selected', true);
        $('#file-name').val('');
        var $fileSection = $('.new-file-section');
        if($fileSection.hasClass('hidden'))
            $fileSection.removeClass('hidden');
        else
            $fileSection.addClass('hidden');
    });
    $('body').on('click', '#addLogButton', function(){
        $('#log-item-type option:eq(0)').prop('selected', true);
        $('#description').val('');
        var $logSection = $('.new-log-section');
        if($logSection.hasClass('hidden'))
            $logSection.removeClass('hidden');
        else
            $logSection.addClass('hidden');
    });
    $('body').on('click', '#add-new-log-button', function(){
        $.get('/api/drivers.php', $('#add-new-log-form').serialize()+'&user='+localStorage.getItem('current_userid'),function(result){
            dt.row.add( [
                result[0].type_name,
                result[0].name + ' ' + result[0].last_name,
                result[0].description,
                result[0].created_date
            ] ).draw();

            $('.new-log-section').addClass('hidden');
        });
    });
});

function loadLogsTable(data){
    $('#datatable-items').html('');

    for(var i = 0; i < data.length; i++){
        var item = data[i];
        $('#datatable-items').append('<tr><td>' + item.type_name + '</td><td>' + item.name + ' ' + item.last_name + '</td><td>' + item.description + '</td><td>' + item.created_date +
            '</td></tr>');
    }

    //Buttons examples
    var dataTable = $('#datatable-buttons').DataTable({
        lengthChange: false,
        searching: false,
        order:[[ 3, "desc" ]]
    });

    return dataTable;
}