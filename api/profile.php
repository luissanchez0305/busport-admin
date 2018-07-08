<?php

include "helper.php";

if(isset($_POST['userId'])) {
    // obtener el usuario

    $userId = $_POST['userId'];

    $user = R::findOne( 'users', 'id = ?', [ $userId ] );
    // update
    if($user && isset($_POST['email']) && isset($_POST['first_name']) && isset($_POST['last_name']) && isset($_POST['username'])){
        // actualizar los datos
        $user->name = $_POST['first_name'];
        $user->last_name = $_POST['last_name'];
        $user->email = $_POST['email'];
        $user->username = $_POST['username'];
        $user->phone = $_POST['phone'];
        R::store( $user );

        // retornar success o fail
        header("location:/pages-dashboard.html?profile=saved");
    }
    // cambiar password
    else if($user && isset($_POST['p'])){
        $user->password = $_POST['p'];
        R::store( $user );
        echo json_encode(array("status" => "ok", "msg" => "Password cambiado"));
    }
    // get
    else{
        // regresar datos en json

        if($user) {
            echo json_encode(array("status" => "ok", "email" => $user->email, "username" =>  $user->username, "first_name" => $user->name, "last_name" => $user->last_name, "phone" => $user->phone, "birthdate" => $user->birthdate));
        }
        else{
            echo json_encode(array("status" => "fail", "msg" => "Usuario no existe"));
        }

    }
}