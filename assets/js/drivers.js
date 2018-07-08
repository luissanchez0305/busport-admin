$(document).ready(function(){
    $.get('/api/drivers.php', { type: 'all' }, function(data){
        $.each(data.drivers, function (i,item){
            $('#drivers').append('<tr><th><span class="co-name">' + item.driver.name + ' ' + item.driver.lastname + '</span></th><td>' + item.driver.personal_id + '</td><td>' + item.driver.blood_type + '</td><td>' + item.driver.contact_phone+ '</td><td>' + (item.driver.finish_date ? 'No' : 'Si') + '</td></tr>');
            $('#status').fadeOut();
            $('#preloader').delay(350).fadeOut('slow');
            $('body').delay(350).css({
                'overflow': 'visible'
            });
        });
    });
});
