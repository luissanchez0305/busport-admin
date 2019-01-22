<?php
include "helper.php";

if(isset($_GET["type"])){
    $type = $_GET["type"];
    switch ($type) {
        case 'user':
            $user_id = $_GET['id'];

            # Regresar un solo user
            $user  = R::findOne( 'users', ' id = ? ', [ $user_id ] );
            echo json_encode(array('user'=>$user));
            break;
        case 'save':
        case 'new':
            if($type == 'new'){
                $user = R::xdispense( 'users' );
            }
            else{
                $user = R::findOne( 'users', ' id = ? ', [ $_GET['userId'] ] );
            }
            $user->name = $_GET['firstName'];
            $user->last_name = $_GET['lastName'];
            $user->document_id = $_GET['personalId'];
            $user->phone = $_GET['phone'];
            $user->email = $_GET['email'];
            $user->password = $_GET['pwd'];
            $user->user_type_id = $_GET['userType'];
            $id = R::store( $user );
            if($type == 'new')
                header("location:/pages-user.html?id=".$id."&on=new");
            else
                header("location:/pages-user.html?id=".$user->id."&on=edit");
            break;
        case 'delete':
            $user = R::findOne( 'users', ' id = ? ', [ $_GET['userId'] ] );
            R::exec( "UPDATE drivers SET user_id = 10 WHERE user_id = $user->id" );
            R::exec( "UPDATE driver_certifications SET user_id = 10 WHERE user_id = $user->id" );
            R::exec( "UPDATE driver_files SET user_id = 10 WHERE user_id = $user->id" );
            R::exec( "UPDATE log_items SET creator_id = 10 WHERE creator_id = $user->id" );
            R::trash( $user );
            echo json_encode(array('status' => 'ok'));
            break;
        default:
            # Regresar todos los users
            $usersArray = array();
            $users = R::findAll( 'users' );
            foreach (array_values($users) as $index => $user) {
                $usersArray[] = array('user'=>$user);
            }
            echo json_encode($usersArray);
            break;
    }
}