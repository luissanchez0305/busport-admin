<?php
include "helper.php";

$user = R::findOne( 'users', ' (username = ? OR email = ?) AND password = ?', [ 'supervisor2', 'supervisor2', 'password2' ] );
if($user)
    echo '--' . $user->id;

/*
EDITAR USUARIO
$supervisor = R::findOne( 'users', ' username = ? ', [ 'supervisor2' ] );
$supervisor->password = 'password2';
$id = R::store( $supervisor );

$supervisor = R::findOne( 'users', ' username = ? ', [ 'supervisor3' ] );
$supervisor->password = 'password3';
$id = R::store( $supervisor );
*/

/*
CREAR USUARIO
$user = R::xdispense( 'users' );
$user_type = R::findOne( 'user_types', ' type_name = ? ', [ 'admin' ] );
$user->user_type = $user_type;
$user->name = 'Luis';
$user->last_name = 'Sanchez';
$user->email = 'lsanchez@esferasoluciones.com';
$user->username = 'lsanchez';
$user->password = 'password1';

$id = R::store( $user );
echo $id . ' - luis';

$user = R::xdispense( 'users' );
$user_type = R::findOne( 'user_types', ' type_name = ? ', [ 'admin' ] );
$user->user_type = $user_type;
$user->name = 'Umberto';
$user->last_name = 'Perrone';
$user->email = 'uperrone@busportgroup.com';
$user->username = 'uperrone';
$user->password = 'password1';

$id = R::store( $user );
echo $id . ' - umberto';

$user = R::xdispense( 'users' );
$user_type = R::findOne( 'user_types', ' type_name = ? ', [ 'admin' ] );
$user->user_type = $user_type;
$user->name = 'Supervisor1';
$user->last_name = 'Supervisor1';
$user->email = 'supervisor1@busportgroup.com';
$user->username = 'supervisor1';
$user->password = 'password1';

$id = R::store( $user );
echo $id . ' - supervisor1';

$user = R::xdispense( 'users' );
$user_type = R::findOne( 'user_types', ' type_name = ? ', [ 'admin' ] );
$user->user_type = $user_type;
$user->name = 'Supervisor2';
$user->last_name = 'Supervisor2';
$user->email = 'supervisor2@busportgroup.com';
$user->username = 'supervisor2';
$user->password = 'password1';

$id = R::store( $user );
echo $id . ' - supervisor2';

$user = R::xdispense( 'users' );
$user_type = R::findOne( 'user_types', ' type_name = ? ', [ 'admin' ] );
$user->user_type = $user_type;
$user->name = 'Supervisor3';
$user->last_name = 'Superviso3';
$user->email = 'supervisor3@busportgroup.com';
$user->username = 'supervisor3';
$user->password = 'password1';

$id = R::store( $user );
echo $id . ' - supervisor3';
*/
