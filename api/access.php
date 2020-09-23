<?php
include "helper.php";

$post = retrieveJsonPostData($_POST);

if(isset($_POST['u']) && isset($_POST['p']) && strlen($_POST['u']) && strlen($_POST['p'])) {
    $username = $_POST['u'];
    $password = $_POST['p'];

    $user = R::findOne( 'users', ' (username = ? OR email = ?) AND password = ? ', [ $username, $username, $password ] );
    if($user) {
        header("location:/pages-stage-login.html?on=" . $user->id . "&type=" . $user->user_type_id);
        //echo json_encode(array('user'=>$user, 'status'=>'ok'));
        die;
    }
}
header("location:/index.html?off=1");
//echo json_encode(array('user'=>[], 'status' => 'no'));
