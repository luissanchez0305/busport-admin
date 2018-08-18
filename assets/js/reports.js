
!function ($) {
    "use strict";

    var Dashboard = function () {
    };

    var dataTable;

    //creates line chart
    Dashboard.prototype.createLineChart = function (element, pointSize, lineWidth, data, xkey, ykeys, labels, lineColors) {
        Morris.Area({
            element: element,
            pointSize: 3,
            lineWidth: 1,
            data: data,
            xkey: xkey,
            ykeys: ykeys,
            labels: labels,
            resize: true,
            gridLineColor: '#eee',
            hideHover: 'auto',
            lineColors: lineColors,
            fillOpacity: 0,
            behaveLikeLine: true
        });
    },
    Dashboard.prototype.isColumnAlreadyOn = function(columns,column){
      for(var i = 0; i < columns.length; i++){
          if(columns[i] == column)
            return true;
      }
    },
    Dashboard.prototype.init = function () {
        $.get('/api/common.php', {type:'log-item-types'}, function(data){
            for(var j = 0; j < data.length; j++){
                var logType = data[j];
                $('#log-item-type').append('<option value='+logType.id+'>'+logType.type_name+'</option>');
            }
        });

        var $dashboard = this;
        $.get('/api/reports.php', { type:'all' },function(data){
            //poner fecha minima
            for(var i = 0; i < data.types.length; i++){
                var type = data.types[i];
                $('#graph-type').append('<option value="'+type.id+'"">'+type.type_name+'</option>');
                $('#infraction-checkboxes').append('<li class="item"><p class="text-muted m-b-0"><input type="checkbox" value="'+type.id+'" data-points="'+type.points+'" class="custom-control-input infraction"' +
                'id="customCheck'+i+'" data-parsley-multiple="groups" data-parsley-mincheck="2">'+
                '<label class="custom-control-label" for="customCheck'+i+'">'+type.type_name+'</label></p></li>');
            }
            $('#infraction-checkboxes').append('<li class="item"><p class="text-muted m-b-0"><input type="checkbox" value="0"" class="custom-control-input working-time"' +
            'id="customCheck'+(i+1)+'" data-parsley-multiple="groups" data-parsley-mincheck="2" disabled="disabled">'+
            '<label class="custom-control-label" for="customCheck'+(i+1)+'">Tiempo de trabajo</label></p></li>')
            .append('<li class="item">&nbsp;</li>');

            $('#infraction-checkboxes').parsley();
            /*for(var i = 0; i < data.months.length; i++){
                var month = data.months[i];
                $('#initial-month').append('<option value='+month.date+'>'+month.date+'</option>');
                $('#final-month').append('<option value='+month.date+'>'+month.date+'</option>');
            }*/
        });
        $('body').on('click','#generate-table',function () {
            /* declare an checkbox array */
            var chkArray = [], infractionNames = [];
            var $infractions_checks = $(".custom-control-input.infraction:checked");
            var datatable_headers;
            /* look for all checkboes that have a class 'chk' attached to it and check if it was checked */
            $infractions_checks.each(function() {
                var $this = $(this);
                chkArray.push($this.val());
                infractionNames.push($this.next().html());
                datatable_headers += '<th>'+$this.next().html() + ' ($' + $this.attr('data-points') + ')' + '</th>';
            });
            datatable_headers += '<th>Total infracciones</th>';
            datatable_headers += '<th>Bono mensual</th>';
            datatable_headers += '<th>Bono Especial</th>';
            datatable_headers += '<th>Bono Total</th>';

            var $header = $('#datatable-logs-header')
            var $items = $('#datatable-items');
            $header.html('');
            $items.html('');

            /* we join the array separated by the comma */
            var infractions_selected = chkArray.join(',');
            var working_time_selected = $(".custom-control-input.working-time:checked").val();
            var working_points = $(".custom-control-input.working-points:checked").val();
            $.get('/api/reports.php', { type:'table', infractions: infractions_selected, working_time: working_time_selected, month:$('#year-month').val(), driver:$('#driverId-report').val() }, function(data){
                /*if(dataTable){
                    $('#datatable-logs').DataTable().destroy();
                    $('#datatable-logs').DataTable().clear();
                }*/
                if(data.logs.length > 0){
                    $header.html('');
                    $items.html('');
                    $header.append('<th>Conductor</th>').append(datatable_headers);
                    var current_driver;
                    var tr = '<tr>';
                    var td = [];
                    var infractionsTotal = 0;
                    var monthBonus = 0;
                    var specialBonus = 0;
                    for(var i = 0; i < data.logs.length; i++){
                        var log_item = data.logs[i];
                        if(current_driver != log_item.name){
                            if(tr.indexOf('td value') > -1){
                                if(td.length < infractionNames.length){
                                    for(var k = 0; k < infractionNames.length - td.length; k++)
                                        tr += '<td value>0</td>';
                                }
                                tr += '<td value>$' + infractionsTotal + '</td>';
                                tr += '<td value>$' + monthBonus + '</td>';
                                tr += '<td value>$' + specialBonus + '</td>';
                                tr += '<td value>$' + (monthBonus + specialBonus - infractionsTotal) + '</td>';
                                $items.append(tr+'</tr>');
                                infractionsTotal = 0;
                                tr = '<tr>';
                                td = [];
                            }

                            current_driver = log_item.name;
                            tr += '<td>' + current_driver + '</td>';
                            monthBonus = parseInt(log_item.month_bonus);
                            specialBonus = parseInt(log_item.special_bonus);
                        }

                        for(var j = 0; j < infractionNames.length; j++){
                            if(data.logs[i].type_name == infractionNames[j]){
                                infractionsTotal += parseInt(data.logs[i].total);
                                td.push(data.logs[i].type_name);
                                tr += '<td value>' + log_item.number + '</td>';
                                break;
                            }
                            else if(td.length < infractionNames.length - 1 && !$dashboard.isColumnAlreadyOn(td, infractionNames[j])){
                                td.push(infractionNames[j]);
                                tr += '<td value>0</td>';
                            }
                        }
                    }
                    if(td.length < infractionNames.length){
                        for(var k = 0; k < infractionNames.length - td.length; k++)
                            tr += '<td value>0</td>';
                    }

                    tr += '<td value>$'+infractionsTotal+'</td>';
                    tr += '<td value>$' + monthBonus + '</td>';
                    tr += '<td value>$' + specialBonus + '</td>';
                    tr += '<td value>$' + (monthBonus + specialBonus - infractionsTotal) + '</td>';
                    $items.append(tr+'</tr>');

                    dataTable = $('#datatable-logs').DataTable({
                        lengthChange: false,
                        searching: false,
                        order:[[ 3, "desc" ]]
                    });
                }
                else {
                    $items.html('No hay registros');
                }
            });
        });
        $('body').on('click','#generate-graph',function () {
            var $initial = $('#initial-month').val();
            var $final = $('#final-month').val();
            var $type = $('#graph-type option:selected');
            $.get('/api/reports.php', { type:'line', init_date: $initial, final_date: $final, log_type: $type.val() }, function(data){
                //creating line chart
                var $graphData = [];
                var graphContainer = 'report-line';
                $('#' + graphContainer).html('');
                if(data.log_counts.length > 0){
                    for(var i = 0; i < data.log_counts.length; i++){
                        var item = data.log_counts[i];
                        $graphData.push({y: item.date, a: item.number})
                    };
                    $dashboard.createLineChart(graphContainer, 0, 0, $graphData, 'y', ['a'], [$type.text()], ['#0097a7']);
                }
                else{
                    $('#' + graphContainer).html('No hay informacion que mostrar');
                }
            });

        });
        $('#year-month, #initial-month, #final-month').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "yy-mm",
            showButtonPanel: true,
            defaultDate: new Date(),
            onChangeMonthYear: function (year, month, inst) {
                $(this).val($.datepicker.formatDate('yy-mm', new Date(year, month - 1, 1)));
            },
            onClose: function(dateText, inst) {
                var month = $(".ui-datepicker-month :selected").val();
                var year = $(".ui-datepicker-year :selected").val();
                $(this).val($.datepicker.formatDate('yy-mm', new Date(year, month, 1)));
            }
        });

        $( "#search-drivers-report" ).autocomplete({
          source: function( request, response ) {
            $.ajax({
              url: "/api/drivers.php",
              dataType: "json",
              data: {
                term: request.term,
                type: 'drivers'
              },
              success: function( data ) {

                response($.map(data, function (item) {
                                return {
                                    id: item.driver.id,
                                    value: item.driver.name
                                }
                            })
                );
              }
            });
          },
          minLength: 2,
          select: function( event, ui ) {
            $('#showAllDrivers').removeClass('hidden');
            $('#driverId-report').val(ui.item.id);
          }
        });
    },
    //init
    $.Dashboard = new Dashboard, $.Dashboard.Constructor = Dashboard
}(window.jQuery),

//initializing
    function ($) {
        "use strict";
        $.Dashboard.init();
    }(window.jQuery);