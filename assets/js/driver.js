var logs_dt;
$(document).ready(  function(){
    var files_dt;
    var certifications_dt;
    var files_url = 'http://busport.esferasoluciones.com/api/files/';
    $('form').parsley();
    $('#expirationDate, #startDate, #finishDate, #certification-date, #initial-log-date, #final-log-date').datepicker({ dateFormat: 'yyyy-mm-dd', maxDate: new Date()});
    $('#expirationDate, #startDate, #finishDate, #certification-date, #initial-log-date, #final-log-date').datepicker( "option", "dateFormat", 'yyyy-mm-dd' ).datepicker("option", "maxDate", new Date());
    if(getUrlVars()['id'] != 'new'){
        $.get('/api/drivers.php', {type:'driver', id:getUrlVars()['id'], online:localStorage.getItem('current_userid')}, function(data){
            $('.page-title').html('Conductor - ' + data.driver.name + ' ' + data.driver.lastname);
            $('.driver-id').val(data.driver.id);
            $('#firstName').val(data.driver.name);
            $('#lastName').val(data.driver.lastname);
            $('#nickName').val(data.driver.nickname);
            $('#personalId').val(data.driver.personal_id);
            $('#socialSecurity').val(data.driver.social_security_number);
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

            if(data.driver.active_status == 1){
                $('#active-driver .btn.activedriver[data-status="on"]').addClass('active').find('input[type="radio"]').prop('checked', true);
                $('#active-driver .btn.activedriver').attr('data-current-value','on');
            }
            else if(data.driver.active_status == 2){
                $('#active-driver .btn.activedriver[data-status="standby"]').addClass('active').find('input[type="radio"]').prop('checked', true);
                $('#active-driver .btn.activedriver').attr('data-current-value','standby');
            }
            else{
                $('#active-driver .btn.activedriver[data-status="off"]').addClass('active').find('input[type="radio"]').prop('checked', true);
                $('#active-driver .btn.activedriver').attr('data-current-value','off');
            }

            for(var j = 0; j < data.logTypes.length; j++){
                var logType = data.logTypes[j];
                $('#log-item-type').append('<option value="'+logType.id+'" data-points="'+logType.points+'" data-substract="'+logType.substract_points+'">'+logType.type_name+'</option>');
            }
            for(var k = 0; k < data.fileTypes.length; k++){
                var fileType = data.fileTypes[k];
                $('#file-item-type').append('<option value='+fileType.id+' data-show-description="'+fileType.show_description+'">'+fileType.name+'</option>');
            }
            for(var l = 0; l < data.certificationTypes.length; l++){
                var certType = data.certificationTypes[l];
                $('#certification-type').append('<option value='+certType.id+' data-show-description="'+certType.show_description+'">'+certType.name+'</option>');
            }

            $('#datatable-items').html('');
            logs_dt = loadLogsTable(data.items, data.isAdmin, parseInt(data.driver.month_bonus) + parseInt(data.driver.special_bonus));

            $('#datatable-certification-items').html('');
            for(var i = 0; i < data.certifications.length; i++){
                var item = data.certifications[i];
                $('#datatable-certification-items').append('<tr data-id="'+item.id+'"><td>'+item.type_name+'</td><td>'+item.certification_date+'</td><td>'+item.description+'</td><td><i class="dripicons-cross text-muted delete-certification"></td></tr>');
            }

            certifications_dt = $('#datatable-certifications').DataTable({
                lengthChange: false,
                searching: false,
                "bSort" : false,
                "bInfo" : false,
                "bPaginate": false
            });

            $('#datatable-file-items').html('');
            for(var i = 0; i < data.files.length; i++){
                var item = data.files[i];
                var induction_id =
                $('#datatable-file-items').append('<tr data-id="'+item.id+'" data-file-type-id="'+item.file_type_id+'"><td>'+item.type_name+'</td><td><a class="link '+(checkImageExtension(item.file_name) ? 'file' : '')+'" '+(checkImageExtension(item.file_name) ? '' : 'target="_blank"')+' '+(checkImageExtension(item.file_name) ? '' : 'href="' + files_url+item.file_name + '"')+'>'+item.file_name+'</a></td><td>'+item.description+'</td><td><i class="dripicons-cross text-muted delete-file"></td></tr>');
                if(item.file_type_id == 9)
                    $('#induction').prop('checked', true);
                if(item.file_type_id == 10)
                    $('#test_written').prop('checked', true);
                if(item.file_type_id == 11)
                    $('#test_drive').prop('checked', true);
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
        $('#active-driver .btn.activedriver[data-status="standby"]').attr('data-current-value','standby').addClass('active').find('input[type="radio"]').prop('checked', true);
        $('.file-items').hide();
    }
    $('body').on('click', '.custom-checkbox', function(e){
        var $this = $(this);
        e.preventDefault();
        var $input = $this.find('input');
        if($input.prop('checked'))
            $input.prop('checked',false);
        else
            $input.prop('checked',true);
    });
    $('body').on('click','.file',function(){
        var url = 'http://busport.esferasoluciones.com/api/files/' + $(this).html();

        $('#myModal img').attr('src',url);
        $('.files button').click();
    });
    $('body').on('change', '#certification-type', function(){
        var $this = $(this);
        var $description = $('#certification-description');
        if($this.find('option:selected').attr('data-show-description') == '1')
            $description.removeClass('hidden')
        else
            $description.addClass('hidden');
    });
    $('body').on('click', '.delete-certification', function(e){
        e.preventDefault();
        var $this_row = $(this).parents('tr');
        // delete file
        $.get('/api/drivers.php', { type: 'delete-certification', certificationId: $this_row.attr('data-id') }, function(){
            certifications_dt.row( $this_row )
                .remove()
                .draw();
        });
    });
    $('body').on('change', '#file-item-type', function(){
        // display description si el tipo de file es show description;
        var $this = $(this);
        var $description = $('#file-description');
        if($this.find('option:selected').attr('data-show-description') == '1')
            $description.removeClass('hidden')
        else
            $description.addClass('hidden');
    });
    $('body').on('click', '.delete-file', function(e){
        e.preventDefault();
        var $this_row = $(this).parents('tr');
        var file_type_id = $this_row.attr('data-file-type-id');

        if(file_type_id == 9){
            $('#induction').prop('checked', false);
        }
        else if(file_type_id == 10){
            $('#test_written').prop('checked', false);
        }
        else if(file_type_id == 11){
            $('#test_drive').prop('checked', false);
        }

        // delete file
        $.get('/api/drivers.php', { type: 'delete-file', fileId: $this_row.attr('data-id') }, function(){
            files_dt.row( $this_row )
                .remove()
                .draw();
        });
    });
    $('body').on('click', '#addFileButton', function(){
        $('#file-item-type option:eq(0)').prop('selected', true);
        $('#file-name').val('');
        $('#file-item-description').val('');
        var $fileSection = $('.new-file-section');
        if($fileSection.hasClass('hidden'))
            $fileSection.removeClass('hidden');
        else
            $fileSection.addClass('hidden');
    });
    $('body').on('click', '#addCertificationButton', function(){
        $('#certification-type option:eq(0)').prop('selected', true);
        $('#certification-date').val('');
        $('#certification-description').val('');
        var $certificationSection = $('.new-certification-section');
        if($certificationSection.hasClass('hidden'))
            $certificationSection.removeClass('hidden');
        else
            $certificationSection.addClass('hidden');
    });
    $('body').on('click', '#add-new-certification-button', function(){
        $.get('/api/drivers.php',
            {
                type: 'add-certification',
                driver_id: $('.driver-id').val(),
                certification_type: $('#certification-type').val(),
                user_id: localStorage.getItem('current_userid'),
                certification_description: $('#certification-description-text').val(),
                certification_date: $('#certification-date').val()
            },
            function(response){
                if(response.status == 'success'){
                    $('#certification-result').html('Certificacion guardada con exito');
                    setTimeout(function(){ $('.new-certification-section').addClass('hidden'); $('#certification-result').html(''); }, 5000);

                    var new_row = certifications_dt.row.add([
                        $('#certification-type option:selected').html(),
                        $('#certification-date').val(),
                        $('#certification-description-text').val(),
                        '<i class="dripicons-cross text-muted delete-certification">'
                    ]);

                    $(new_row.node()).attr('data-id', response.id);
                    new_row.draw();
                }
                else{
                    $('#certification-result').html('Ha ocurrido un error, intente nuevamente');
                }
            }
        );
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
                            user_id: localStorage.getItem('current_userid'),
                            file_description: $('#file-item-description').val()
                        },
                        function(response){
                                var new_row = files_dt.row.add( [
                                    $('#file-item-type option:selected').text(),
                                    '<a class="link file"'+(checkImageExtension(php_script_response) ? '' : 'target="_blank"')+'>' + php_script_response + '</a>',
                                    $('#file-item-description').val(),
                                    '<i class="dripicons-cross text-muted delete-file">'
                                ] );
                                $(new_row.node()).attr('data-id', response.id);
                                new_row.draw();
                                $('.new-file-section').addClass('hidden');

                        }
                    );
                else{
                    if(php_script_response.indexOf('file type') > -1)
                        $('#file-upload-result').html('Tipo de archivo incorrecto');
                    else
                        $('#file-upload-result').html('Error al subir archivo');

                    setTimeout(function(){ $('#file-upload-result').html(''); }, 5000);
                }
            }
         });
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
                loadSwitchStatusLabels(result[0], true, 'manual') + '<a class="btn btn-success print-ticket" href="#" role="button">Imprimir</a></td>'
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
    $('body').on('click', '.btn.activedriver', function(e){
        e.preventDefault();
        var $this = $(this);
        if(!$this.hasClass('active') && $('#driverId').val() != 'id'){
            var status_pressed = $this.attr('data-status');
            $.get('/api/drivers.php', {type:'status', id:$('#driverId').val(), action:status_pressed }, function(){
                toggleActiveStatus($this);
                $('#active-driver-message').removeClass('hidden').html('El conductor ha sido ' + (status_pressed == 'on' ? 'activado' : status_pressed == 'standby' ? 'cambiado' : 'desactivado'));
                setTimeout(function(){ $('#active-driver-message').addClass('hidden') }, 5000);
            });
        }
        else if($('#driverId').val() == 'id'){
            toggleActiveStatus($this);
        }
    });
    $('body').on('click', '.print-ticket', function(e){
        e.preventDefault();
        var $this = $(this);
        window.open('/pages-tickets.html?ticket=' + $this.parents('tr').attr('data-id'), '_blank');
    });
    $('body').on('click', '.reload-logs-table', function(e){
        e.preventDefault();
        $.get('/api/drivers.php', { type: 'driver-dates', id: $('#driverId').val(), online: localStorage.getItem('current_userid'), init_date: $('#initial-log-date').val(), final_date: $('#final-log-date').val() }, function(data){
            logs_dt.destroy();
            $('#datatable-items').html('');
            logs_dt = loadLogsTable(data.items, data.isAdmin, parseInt(data.driver.month_bonus) + parseInt(data.driver.special_bonus));
        });
    });
    $('body').on('click', '.induction', function(){
        var check = $(this).find('input[type="checkbox"]');
        var check_name = check.attr('id');
        var _file_type_id =check_name == 'induction' ? '9' : (check_name == 'test_written' ? '10' : '11');
        if(check.is(':checked')){
            check.prop('checked', false);
            $('#file-item-type').val(_file_type_id);
            $("#file-name").change(function (){
                check.prop('checked', true);
                $('#add-new-file-button').click();
                $("#file-name").unbind('change');
                $("#file-name").val('');
            });
            $('#file-name').click();
        }
        else{
            var r = confirm("Al quitar esta opcion se borrará la imagen\nEstá seguro?");
            if(r == true){
                $.get('/api/drivers.php',{ type: 'induction', file_type_id: _file_type_id, id: $('#driverId').val() }, function(data){
                    $('#datatable-file-items').find('tr[data-id="'+data.id+'"] .delete-file').click();
                });
            }
            else{
                check.prop('checked', true);
            }
        }
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
function toggleActiveStatus($this){
    $('#active-driver .btn.activedriver').attr('data-current-value',$this.attr('data-status'));
    $('#active-driver .btn.activedriver').removeClass('active');
    $('#active-driver .btn.activedriver input').prop('checked',false);
    $this.addClass('active').find('input').prop('checked',true);
}

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
                loadSwitchStatusLabels(item,isAdmin,'') + '<a class="btn btn-success print-ticket" href="#" role="button">Imprimir</a></td></tr>');
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
        $.get('/api/drivers.php', {type:'log-update-status', id:$this.parents('tr').attr('data-id'), action:$this.attr('data-status') }, function(){
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

function checkImageExtension(file){
    return file.indexOf('pdf') == -1;
}

function loadSwitchStatusLabels(item, isAdmin, manual){
    return '<label data-current-value="'+item.status+'" data-status="on" class="btn activestatus btn-light activestatus_'+item.id+' '+manual+' '+(item.status == '1' ? 'active' : '')+ (!isAdmin ? ' hidden ':'')+'" data-custom-points="'+item.custom_points+'" data-points="'+item.log_type_points+'"><input type="radio" name="activestatus_'+item.id+'" id="option1_'+item.id+'" autocomplete="off" '+(item.status == '1' ? 'checked' : '')+'>Si</label>' +
        '<label data-current-value="'+item.status+'" data-status="off" class="btn activestatus btn-light activestatus_'+item.id + ' ' + manual + ' ' +(item.status == '1' ? '' : 'active')+'" data-custom-points="'+item.custom_points+'" data-points="'+item.log_type_points+'"><input type="radio" name="activestatus_'+item.id+'" id="option2_'+item.id+'" autocomplete="off" '+(item.status == '1' ? '' : 'checked')+'>' + (isAdmin ? 'No' : 'Borrar') + '</label>';
}