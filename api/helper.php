<?php

require 'lib/rb-mysql.php';
header('Content-type: application/json');
header("access-control-allow-origin: *");

$username = 'espheras_dbuser';
$password = 'Goingupinlife123';
$database = 'espheras_busport';
$dbhost = '162.210.98.37';

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