console.log(location.pathname);
$(document).ready(function(){
    var isTransition = localStorage.getItem('isTransition');
    var current_userid = localStorage.getItem('current_userid');
    if(isTransition == '1'){
        localStorage.setItem('isTransition','0');
        if(getUrlVars()['off'])
            alert('Username / email o contraseña equivocadas')
        else if(getUrlVars()['on'])
            localStorage.setItem('current_userid', getUrlVars()['on']);
        else
            alert('Algo salio mal :(');
    }
    else if(location.pathname == '/' && (typeof current_userid !== 'undefined' && current_userid != "null")){
        var user = localStorage.getItem('current_userid');
        location.href = 'dashboard.html?on=' + user;
    }
    else if(location.pathname != '/' && (current_userid == "null" || typeof current_userid == 'undefined')){
        location.href = '/';
    }
});
$('body').on('click','#login',function(){
    localStorage.setItem('isTransition','1');
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