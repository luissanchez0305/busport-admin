console.log(location.pathname);
$(document).ready(function(){
    var isTransition = localStorage.getItem('isTransition');
    var current_userid = localStorage.getItem('current_userid');
    // si es durante un login isTransition es 1
    if(isTransition == '1'){
        localStorage.setItem('isTransition','0');
        if(getUrlVars()['off'])
            $('#wrong-password-text').removeClass('hidden');
        else if(getUrlVars()['on'])
            localStorage.setItem('current_userid', getUrlVars()['on']);
        else
            alert('Algo salio mal :(');
    }
    // si esta logueado y esta entrando a la pagin de login, llevarlo al dashboard
    else if((location.pathname == '/' || location.pathname == '/index.html') && (typeof current_userid !== 'undefined' && current_userid != "null")){
        var user = localStorage.getItem('current_userid');
        location.href = 'dashboard.html?on=' + user;
    }
    // si no esta logueado y no es la pagina de login, llevarlo a login
    else if(location.pathname != '/' && location.pathname != '/index.html' && (current_userid == "null" || typeof current_userid == 'undefined')){
        location.href = '/';
    }
    // si la contraseña se recupero con exito, mostrar mensaje de forgot password
    else if((location.pathname == '/' || location.pathname == '/index.html') && getUrlVars()['recover'] && getUrlVars()['off'] == "1"){
        $('#forgot-password-text').removeClass('hidden');
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