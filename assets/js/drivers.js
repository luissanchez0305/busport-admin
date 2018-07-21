$(document).ready(function(){
    $('body').on('click','.driver',function(){
      $this = $(this);
      $.get('/api/drivers.php', { type: 'driver', id: $this.attr('data-value') }, function(data){
        location.href='pages-driver.html?id='+data.id;
      });

    });

    $.get('/api/drivers.php', { type: 'all' }, function(data){
        displayTableResult(data);
        $('#status').fadeOut();
        $('#preloader').delay(350).fadeOut('slow');
        $('body').delay(350).css({
            'overflow': 'visible'
        });
    });

    $('body').on('click','#search-drivers-button', function(){
        $.ajax({
          url: "/api/drivers.php",
          dataType: "json",
          data: {
            term: $( "#search-drivers" ).val(),
            type: 'drivers'
          },
          success: function( data ) {
            $('#drivers').html('');
            displayTableResult(data);
          }
        });
    })

    $( "#search-drivers" ).autocomplete({
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
        $.get('/api/drivers.php', { type: 'driver', id: ui.item.id }, function(data){
            $('#drivers').html('');
            displayTableResult(data);
        });
      }
    });
});

function displayTableResult(array){
    $.each(array, function (i,item){
        $('#drivers').append('<tr class="driver" data-value="'+item.driver.id+'"><th><span class="co-name">' + item.driver.name + ' ' + item.driver.lastname + '</span></th><td>' + item.driver.personal_id + '</td><td>' + item.driver.blood_type + '</td><td>' + item.driver.contact_phone+ '</td><td>' + (item.driver.finish_date ? 'No' : 'Si') + '</td></tr>');
    });
}
