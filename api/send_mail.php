<?php

include "helper.php";
include('mail/php-mailjet-v3-simple.class.php');

$post = retrieveJsonPostData($_POST);
if(isset($post->e)) {
    
    $to      = $post->e;
    $pwd     = RandomString();
	
    $user = R::findOne( 'users', 'email = ?', [ $to ] );
    if($user){
        $user->password = $pwd;
        R::store( $user );
        $params = array(
            "method" => "POST",
            "from" => "hablemos@esferasoluciones.com",
            "to" => $to,
            "subject" => 'BusPort - Tu nuevo password',
            "text" => "Este es su nuevo password:"."\r\n".$pwd."\r\n"."Asegurate de cambiarlo al loguearte"
        );
        $mj = new Mailjet( 'be82026b9fe11c82acb01de4c7889764', 'aac2f621c45039bb1eb8a1e3dbe3f08f' );
        
        $result = $mj->sendEmail($params);
        $response = array();
    	
        if ($mj->_response_code == 200) {
            echo json_encode(array("status" => "ok"));
        } else {
            echo json_encode(array("status" => "fail", "msg" =>  $mj->_response_code));
        }
        die;
    }
    echo json_encode(array("status" => "nouser", "msg" =>  'El correo no existe'));
}
?> 