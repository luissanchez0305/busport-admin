
!function ($) {
    "use strict";

    var Dashboard = function () {
    };

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
    Dashboard.prototype.init = function () {
        var $this = this;
        $.get('/api/reports.php', { type:'all' },function(data){
            //poner fecha minima
            for(var i = 0; i < data.types.length; i++){
                var type = data.types[i];
                $('#graph-type').append('<option value="'+type.id+'"">'+type.type_name+'</option>');
                $('#infraction-checkboxes').append('<li class="item"><p class="text-muted m-b-0"><input type="checkbox" value="'+type.id+'"" class="custom-control-input infraction"' +
                'id="customCheck'+i+'" data-parsley-multiple="groups" data-parsley-mincheck="2">'+
                '<label class="custom-control-label" for="customCheck'+i+'">'+type.type_name+'</label></p></li>');
            }
            $('#infraction-checkboxes').append('<li class="item"><p class="text-muted m-b-0"><input type="checkbox" value="0"" class="custom-control-input working-time"' +
            'id="customCheck'+(i+1)+'" data-parsley-multiple="groups" data-parsley-mincheck="2">'+
            '<label class="custom-control-label" for="customCheck'+(i+1)+'">Tiempo de trabajo</label></p></li>')
            .append('<li class="item"><p class="text-muted m-b-0"><input type="checkbox" value="-1"" class="custom-control-input working-points"' +
            'id="customCheck'+(i+2)+'" data-parsley-multiple="groups" data-parsley-mincheck="2" disabled="disabled">'+
            '<label class="custom-control-label" for="customCheck'+(i+2)+'">Puntaje</label></p></li>')
            .append('<li class="item">&nbsp;</li>');

            $('#infraction-checkboxes').parsley();
            for(var i = 0; i < data.months.length; i++){
                var month = data.months[i];
                $('#initial-month').append('<option value='+month.date+'>'+month.date+'</option>');
                $('#final-month').append('<option value='+month.date+'>'+month.date+'</option>');
            }
        });
        $('body').on('click','#generate-table',function () {
            /* declare an checkbox array */
            var chkArray = [];
            $infractions_checks = $(".custom-control-input.infraction:checked");
            datatable_headers;
            /* look for all checkboes that have a class 'chk' attached to it and check if it was checked */
            $infractions_checks.each(function() {
                $this = $(this);
                chkArray.push($this.val());
                datatable_headers += '<th>'+$this.html+'</th>';
            });

            /* we join the array separated by the comma */
            var infractions_selected = chkArray.join(',');
            var working_time_selected = $(".custom-control-input.working-time:checked").val();
            var working_points = $(".custom-control-input.working-points:checked").val();
            $.get('/api/reports.php', { type:'table', infractions: infractions_selected, working_time: working_time_selected }, function(data){
                if(data.logs.length > 0){
                    $header = $('#datatable-logs-header')
                    $header.append('<th>Conductor</th>').append(datatable_headers);

                    for(var i = 0; i < data.logs.length; i++){
                        var log_item = data.logs[i];
                        $('#datatable-file-items').append('<tr><td>'+log_item.type_name+'</td><td>'+log_item.number+'</td></tr>');
                    }

                }
            });
        });
        $('body').on('click','#generate-graph',function () {
            var $initial = $('#initial-month option:selected').val();
            var $final = $('#final-month option:selected').val();
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
                    $this.createLineChart(graphContainer, 0, 0, $graphData, 'y', ['a'], [$type.text()], ['#0097a7']);
                }
                else{
                    $('#' + graphContainer).html('No hay informacion que mostrar');
                }
            });

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