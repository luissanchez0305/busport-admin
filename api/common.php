<?php
include "helper.php";

if(isset($_GET["type"])){

    $type = $_GET["type"];
    switch ($type) {
        case "log-item-types":

            $logTypes = R::getAll( 'SELECT id, type_name FROM log_item_types' );
            echo json_encode($logTypes);
            break;
    }
}