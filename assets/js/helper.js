$(document).ready(function(){
    var isTransition = localStorage.getItem('isTransition');
    var current_userid = localStorage.getItem('current_userid');
    var current_user_type = localStorage.getItem('current_user_type');
    if(typeof current_userid !== 'undefined' && (current_userid != null && current_userid != "null") && (typeof current_user_type === 'undefined' || current_user_type == null || current_user_type == "null")){
        location.href = 'api/user.php?u=' + current_userid;
    }
    // si es durante un login isTransition es 1
    if(isTransition == '1'){
        localStorage.setItem('isTransition','0');
        if(getUrlVars()['off'])
            $('#wrong-password-text').removeClass('hidden');
        else if(typeof current_userid === 'undefined' || current_userid == null || current_userid == "null"){
            location.href = '/';
        }
        /*else
            alert('Algo salio mal :(');*/
    }
    // si esta logueado y esta entrando a la pagin de login, llevarlo al dashboard
    else if((location.pathname == '/' || location.pathname == '/index.html') && (typeof current_userid !== 'undefined' && (current_userid != null && current_userid != "null"))){
        var user = localStorage.getItem('current_userid');
        var type = localStorage.getItem('current_user_type');
        location.href = 'pages-stage-login.html?on=' + user + "&type=" + type;
    }
    // si la contraseña se recupero con exito, mostrar mensaje de forgot password
    else if((location.pathname == '/' || location.pathname == '/index.html') && getUrlVars()['recover'] && getUrlVars()['recover'] == "1"){
        $('#forgot-password-text').removeClass('hidden');
    }
    // si no esta logueado y no es la pagina de login, llevarlo a login
    else if(location.pathname != '/' && (current_userid == "null" || current_userid == null || typeof current_userid == 'undefined')){
        if(location.pathname == '/pages-recoverpw.html'){
            if(getUrlVars()['recover'] && getUrlVars()['recover'] == "2" && getUrlVars()['email']){
                $('#email-not-found-text').removeClass('hidden');
                $('#e').val(getUrlVars()['email']);
            }
        }
        else
            location.href = '/';
    }
    else if(getUrlVars()['profile'] && getUrlVars()['profile'] == 'saved'){
        alert('Su perfil ha sido guardado con exito');
    }
    $('#create-infraction').click(function(){
        $.get('/api/drivers.php', $('#add-new-log-form').serialize()+'&user='+localStorage.getItem('current_userid'),function(result){
            $('#infraction-result-text').html('Infraccion creada');
            setTimeout(function(){ $('.modal-content #close-modal').click() }, 5000);
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
    });

    $( "#search-drivers, #search-drivers-table" ).keypress(function(key){
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

    var $search_modal = $( "#myModal #search-drivers, #search-drivers-table" );
    if($search_modal){
        $search_modal.autocomplete({
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
            $.get('/api/drivers.php', { type: 'driver', id: ui.item.id, online: localStorage.getItem('current_userid') }, function(data){
                if(location.href.indexOf('pages-drivers') > -1 && !$('#myModal').hasClass('show')){
                    $('#drivers').html('');
                    displayTableResult(data);
                }
                else{
                    $('#myModal #driverId').val(data.driver.id);
                }
            });
          }
        });
    }

});
$('body').on('click','#login',function(){
    localStorage.setItem('isTransition','1');
    $('#forgot-password-text').addClass('hidden');
    $('#loginform').submit();
});
$('body').on('click','#logout',function(){
    localStorage.setItem('current_userid', null);
    location.href = '/';
});
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}