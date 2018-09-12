<?php
include "helper.php";

$post = retrieveJsonPostData($_POST);

if(isset($_GET['u'])) {
    $userid = $_GET['u'];

    $user = R::findOne( 'users', ' id = ? ', [ $userid ] );
    if($user) {
        header("location:/pages-stage-login.html?on=" . $user->id . "&type=" . $user->user_type_id);
        //echo json_encode(array('user'=>$user, 'status'=>'ok'));
        die;
    }
}
header("location:/index.html?off=1");
//echo json_encode(array('user'=>[], 'status' => 'no'));
