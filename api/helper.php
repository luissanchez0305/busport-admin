<?php

require 'lib/rb-mysql.php';
header('Content-type: application/json');
header("access-control-allow-origin: *");

/*$username = 'root';
$password = 'goingup123';
$database = 'espheras_busport';
$dbhost = '54.184.116.119';*/
$username = 'admin_busport';
$password = 'vaouLgGnbWAM';
$database = 'busport';
$dbhost = 'localhost';

R::setup( 'mysql:host=' . $dbhost .';dbname=' . $database, $username, $password );
R::ext('xdispense', function( $type ){
    return R::getRedBean()->dispense( $type );
});
R::freeze( TRUE );

function retrieveJsonPostData() {
    // get the raw POST data
    $rawData = file_get_contents("php://input");

    // this returns null if not valid json
    return json_decode($rawData);
}

function RandomString()
{
    $characters = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ';
    $randstring = '';
    for ($i = 0; $i < 7; $i++) {
        $randstring .= $characters[rand(0, strlen($characters))];
    }
    return $randstring;
}