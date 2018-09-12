<?php
    if(isset($_POST["submit"])) {
        if ( 0 < $_FILES['file']['error'] ) {
            echo 'error: ' . $_FILES['file']['error'] . '<br>';
        }
        else {
            $extension = end(explode(".", $_FILES['file']['name']));
            echo $extension;
            
            $check = getimagesize($_FILES["file"]["tmp_name"]);
            if($check !== false) {
                echo $check["mime"];
            }
            if($extension == 'png' || $extension == 'jpg' || $extension == 'jpeg' || $extension == 'pdf' || $extension == 'zip' || $extension == 'doc' || $extension == 'docx'){
                $file_name = generateRandomString().'.'.$extension;
                move_uploaded_file($_FILES['file']['tmp_name'], dirname(__FILE__).'/files/' . $file_name);
                echo $file_name;
            }
            else
                echo 'error: file type';
        }
    }
    function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }