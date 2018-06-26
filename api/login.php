<?php
include "helper.php";

$post = retrieveJsonPostData($_POST);

if(isset($post->u) && isset($post->p)) {
    $user = R::findOne( 'users', ' (username = ? OR email = ?) AND password = ? ', [ $post->u, $post->u, $post->p ] );
    if($user){
        echo json_encode(array('user'=>$user, 'status'=>'ok'));
        die;
    }
}
echo json_encode(array('user'=>[], 'status' => 'no'));
