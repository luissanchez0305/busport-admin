$(document).ready(function(){
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
    $( "#search-drivers" ).keypress(function(key){
      if(key.keyCode == 13){
        $('#showAllDrivers').removeClass('hidden');
        $this = $(this);
        $this.blur();
        $.get('/api/drivers.php', { type: 'drivers', term: $this.val() }, function(data){
            $('#drivers').html('');
            displayTableResult(data);
        });
      }
    });
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
        $('#showAllDrivers').removeClass('hidden');
        $.get('/api/drivers.php', { type: 'driver', id: ui.item.id }, function(data){
            $('#drivers').html('');
            displayTableResult(data);
        });
      }
    });
});

function showAllDrivers(){
    $.get('/api/drivers.php', { type: 'all' }, function(data){
        $('#showAllDrivers').addClass('hidden');
        $('#drivers').html('');
        displayTableResult(data);
        $('#status').fadeOut();
        $('#preloader').delay(350).fadeOut('slow');
        $('body').delay(350).css({
            'overflow': 'visible'
        });
    });
}

function displayTableResult(array){
    if(array.id){
        $('#drivers').append('<tr class="driver" data-value="'+array.id+'"><th><span class="co-name">' + array.name + ' ' + array.lastname + '</span></th><td>' + array.personal_id + '</td><td>' + array.blood_type + '</td><td>' + array.contact_phone+ '</td><td>' + (array.finish_date ? 'No' : 'Si') + '</td></tr>');
    }
    else {
      $.each(array, function (i,item){
          $('#drivers').append('<tr class="driver" data-value="'+item.driver.id+'"><th><span class="co-name">' + item.driver.name + ' ' + item.driver.lastname + '</span></th><td>' + item.driver.personal_id + '</td><td>' + item.driver.blood_type + '</td><td>' + item.driver.contact_phone+ '</td><td>' + (item.driver.finish_date ? 'No' : 'Si') + '</td></tr>');
      });
    }
}
