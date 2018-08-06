
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
                $('#graph-type').append('<option value='+type.id+'>'+type.type_name+'</option>');
            }
            for(var i = 0; i < data.months.length; i++){
                var month = data.months[i];
                $('#initial-month').append('<option value='+month.date+'>'+month.date+'</option>');
                $('#final-month').append('<option value='+month.date+'>'+month.date+'</option>');
            }
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