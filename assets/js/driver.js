var logs_dt;
$(document).ready(function(){
    var files_dt;
    $('form').parsley();
    $('#expirationDate, #startDate, #finishDate').datepicker({ dateFormat: 'yyyy-mm-dd' });
    $('#expirationDate, #startDate, #finishDate').datepicker( "option", "dateFormat", 'yyyy-mm-dd' );
    if(getUrlVars()['id'] != 'new'){
        $.get('/api/drivers.php', {type:'driver', id:getUrlVars()['id'], online:localStorage.getItem('current_userid')}, function(data){
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
            $('#bp-phone').val(data.driver.busport_phone);
            $('#email').val(data.driver.email);
            $('#address').val(data.driver.address);
            $('#contactName').val(data.driver.emergency_name);
            $('#contactRelation').val(data.driver.emergency_relation);
            $('#contactPhone').val(data.driver.emergency_phone);
            $('#contactName2').val(data.driver.emergency_name2);
            $('#contactRelation2').val(data.driver.emergency_relation2);
            $('#contactPhone2').val(data.driver.emergency_phone2);
            $('#baseBonus').val(data.driver.base_bonus);
            $('#monthBonus').val(data.driver.month_bonus);
            $('#specialBonus').val(data.driver.special_bonus);

            for(var j = 0; j < data.logTypes.length; j++){
                var logType = data.logTypes[j];
                $('#log-item-type').append('<option value="'+logType.id+'" data-points="'+logType.points+'" data-substract="'+logType.substract_points+'">'+logType.type_name+'</option>');
            }
            for(var k = 0; k < data.fileTypes.length; k++){
                var fileType = data.fileTypes[k];
                $('#file-item-type').append('<option value='+fileType.id+'>'+fileType.name+'</option>');
            }

            $('#datatable-items').html('');
            logs_dt = loadLogsTable(data.items, data.isAdmin, parseInt(data.driver.month_bonus) + parseInt(data.driver.special_bonus));

            $('#datatable-file-items').html('');
            for(var i = 0; i < data.files.length; i++){
                var item = data.files[i];
                $('#datatable-file-items').append('<tr data-id="'+item.id+'"><td>'+item.type_name+'</td><td><a class="link file">'+item.file_name+'</a></td></tr>');
            }
            files_dt = $('#datatable-files').DataTable({
                lengthChange: false,
                searching: false,
                "bSort" : false,
                "bInfo" : false,
                "bPaginate": false
            });
        });
    }
    else{
        $('.page-title').html('Nuevo Conductor');
        $('#type').val('new');
        $('.log-section').addClass('hidden');
    }
    $('body').on('click','.file',function(){
        var url = 'http://busport.esferasoluciones.com/api/files/' + $(this).html();

        $('#myModal img').attr('src',url);
        $('.files button').click();
    });
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
        $('#log-item-points').val('0');
        $('#description').val('');
        var $logSection = $('.new-log-section');
        if($logSection.hasClass('hidden'))
            $logSection.removeClass('hidden');
        else
            $logSection.addClass('hidden');
    });
    $('body').on('click', '#add-new-log-button', function(){
        var $this = $(this);
        $.get('/api/drivers.php', $('#add-new-log-form').serialize()+'&user='+localStorage.getItem('current_userid'),function(result){
            $('#infractionsAmount').html('$' + (parseInt($('#infractionsAmount').html().substring(1)) + parseInt($('#log-item-type option:selected').attr('data-points'))));
            if($('#log-item-type option:selected').attr('data-substract') == '1'){
                $('#specialPerformanceBonus').html('$' + (parseInt($('#specialPerformanceBonus').html().substring(1)) + parseInt($('#log-item-points').val())));
            }
            $('#bonusAmount').html('$' + (parseInt($('#bonusAmount').html().substring(1)) - parseInt($('#log-item-type option:selected').attr('data-points')) + parseInt($('#log-item-points').val())));
            rowId = result[0].id;
            logs_dt.row.add( [
                result[0].type_name,
                result[0].name + ' ' + result[0].last_name,
                result[0].description,
                (result[0].custom_points > 0 ? '$' : '-$') + (result[0].custom_points > 0 ? result[0].custom_points : result[0].log_type_points),
                result[0].created_date,
                loadSwitchStatusLabels(result[0], true, 'manual')
            ] ).draw();

            $('.new-log-section').addClass('hidden');
        });
    });
    $('body').on('change', '#log-item-type', function(e){
        if($(this).find('option:selected').attr('data-substract') == '1')
            $('#custom-points').removeClass('hidden');
        else
            $('#custom-points').addClass('hidden');
    });
    $('body').on('click', '.btn.activestatus', function(e){
        e.preventDefault();
        switchLogStatus(this);
    });
    $('body').on('click', '#add-new-file-button', function(){
        var file_data = $('.new-file-section #file-name').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);

        $.ajax({
            url: '/api/upload.php', // point to server-side PHP script
            dataType: 'text',  // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(php_script_response){
                if(php_script_response.toLowerCase().indexOf('error') == -1 && php_script_response.toLowerCase().indexOf('warning') == -1)
                    $.get('/api/drivers.php',
                        {
                            type: 'add-file',
                            file_name: php_script_response,
                            driver_id: $('.driver-id').val(),
                            file_item_type: $('#file-item-type').val(),
                            user_id: localStorage.getItem('current_userid')
                        },
                        function(){
                            files_dt.row.add( [
                                $('#file-item-type option:selected').text(),
                                php_script_response
                            ] ).draw();

                            $('.new-file-section').addClass('hidden');
                        }
                    );
                else
                    alert('error subiendo archivo: ' + php_script_response);
            }
         });
    });
    window.Parsley.addValidator('checkFileType', {
        validateString: function(value) {
        return value.length > 0 && !$('.new-file-section').hasClass('hidden');
        },
        messages: {
            en: 'Escoge una opcion'
        }
    });
});

var rowId;
function loadLogsTable(data,isAdmin,monthBonus){
    var currentMonthObj = new Date();
    var month = currentMonthObj.getUTCMonth() + 1; //months from 1-12
    var year = currentMonthObj.getUTCFullYear();
    var currentMonth = year + '-' + (month<12 ? '0' + month : month);
    var infractionsAmount = 0;
    var customPoints = 0;
    for(var i = 0; i < data.length; i++){
        var item = data[i];
        if(currentMonth == item.created_date.substring(0,7) && item.status == '1'){
            infractionsAmount += parseInt(item.log_type_points);
            customPoints += parseInt(item.custom_points);
            monthBonus = parseInt(monthBonus) - parseInt(item.log_type_points) + parseInt(item.custom_points);
        }
        if(isAdmin || item.status == '1')
            $('#datatable-items').attr('data-admin',isAdmin?'true':'false').append('<tr data-id="'+item.id+'"><td>' + item.type_name + '</td><td>' + item.name + ' ' + item.last_name + '</td><td>' + item.description + '</td><td>' + (item.custom_points > 0 ? '$' : '-$') + (item.custom_points > 0 ? item.custom_points : item.log_type_points) + '</td><td>' + item.created_date +
                '</td>'+'<td data-toggle="buttons">' +
                loadSwitchStatusLabels(item,isAdmin,'') + '</td>'+'</tr>');
    }
    $('#infractionsAmount').html('$' + infractionsAmount);
    $('#specialPerformanceBonus').html('$' + customPoints);
    $('#bonusAmount').html('$' + monthBonus);
    //Buttons examples
    var dataTable = $('#datatable-buttons').DataTable({
        'createdRow': function( row, data, dataIndex ) {
            $(row).attr('data-id', rowId);
        },
        lengthChange: false,
        searching: false,
        order:[[ 4, "desc" ]]
    });

    return dataTable;
}

function switchLogStatus(obj){
    $this = $(obj);

    if($this.attr('data-status') != ($this.attr('data-current-value') == '1' ? 'on' : 'off')){
        var $label = $('.'+$this.find('input').attr('name'));
        if($this.hasClass('manual')){
            $($label[0]).toggleClass('active');
            $($label[1]).toggleClass('active');
        }
        $.get('/api/drivers.php', {type:'item', id:$this.parents('tr').attr('data-id'), action:$this.attr('data-status') }, function(){
            $label.attr('data-current-value', $this.attr('data-status') == 'on' ? '1' : '0');
            if($('#datatable-items').attr('isAdmin') == 'false')
                $this.parents('tr').remove();
            if($this.attr('data-status') == 'on'){
                $('#infractionsAmount').html('$' + (parseInt($('#infractionsAmount').html().substring(1)) + parseInt($this.attr('data-points'))));
                $('#specialPerformanceBonus').html('$' + (parseInt($('#specialPerformanceBonus').html().substring(1)) + parseInt($this.attr('data-custom-points'))));
                $('#bonusAmount').html('$' + (parseInt($('#bonusAmount').html().substring(1)) - parseInt($this.attr('data-points')) + parseInt($this.attr('data-custom-points'))));
            }
            else{
                $('#infractionsAmount').html('$' + (parseInt($('#infractionsAmount').html().substring(1)) - parseInt($this.attr('data-points'))));
                $('#specialPerformanceBonus').html('$' + (parseInt($('#specialPerformanceBonus').html().substring(1)) - parseInt($this.attr('data-custom-points'))));
                $('#bonusAmount').html('$' + (parseInt($('#bonusAmount').html().substring(1)) + parseInt($this.attr('data-points')) - parseInt($this.attr('data-custom-points'))));
            }
        });
    }
}

function loadSwitchStatusLabels(item, isAdmin, manual){
    return '<label data-current-value="'+item.status+'" data-status="on" class="btn activestatus btn-light activestatus_'+item.id+' '+manual+' '+(item.status == '1' ? 'active' : '')+ (!isAdmin ? ' hidden ':'')+'" data-custom-points="'+item.custom_points+'" data-points="'+item.log_type_points+'"><input type="radio" name="activestatus_'+item.id+'" id="option1_'+item.id+'" autocomplete="off" '+(item.status == '1' ? 'checked' : '')+'>Si</label>' +
        '<label data-current-value="'+item.status+'" data-status="off" class="btn activestatus btn-light activestatus_'+item.id + ' ' + manual + ' ' +(item.status == '1' ? '' : 'active')+'" data-custom-points="'+item.custom_points+'" data-points="'+item.log_type_points+'"><input type="radio" name="activestatus_'+item.id+'" id="option2_'+item.id+'" autocomplete="off" '+(item.status == '1' ? '' : 'checked')+'>' + (isAdmin ? 'No' : 'Borrar') + '</label>';
}