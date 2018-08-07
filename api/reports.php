<?php
include "helper.php";

if(isset($_GET["type"])){
    $type = $_GET["type"];
    switch ($type) {
        case 'table':
            $infractions = $_GET['infractions'];
            if($infractions){
                $logs = R::getAll( "SELECT d.name, lit.type_name, COUNT(*) as number, SUM(lit.points) AS total
                FROM log_items li
                JOIN log_item_types lit ON lit.id = li.log_item_type
                JOIN drivers d ON d.id = li.driver_id
                WHERE li.log_item_type IN (:infractions)
                GROUP BY lit.type_name, d.name", [':infractions' => $infractions] );
                echo json_encode(array('logs'=>$logs));
            }
            break;
        case 'line':
            $init_date = $_GET['init_date'];
            $final_date = $_GET['final_date'];
            $log_type = $_GET['log_type'];
            $log_counts = R::getAll( "SELECT DATE_FORMAT(li.created_date,'%Y-%m') AS date, COUNT(*) AS number
                FROM log_items li
                JOIN log_item_types lit ON lit.id = li.log_item_type
                WHERE created_date >= CONCAT(:init_date,'-01') AND created_date <= CONCAT(:final_date,'-31') AND li.log_item_type = :log_type
                GROUP BY lit.type_name, DATE_FORMAT(li.created_date,'%Y-%m')",
                [':init_date' => $init_date, ':final_date' => $final_date, ':log_type' => $log_type]
            );
            echo json_encode(array('log_counts'=>$log_counts));
            break;
        default:
            $months = R::getAll( "SELECT DATE_FORMAT(created_date,'%Y-%m') AS date FROM log_items GROUP BY DATE_FORMAT(created_date,'%Y-%m') ORDER BY created_date");
            $types  = R::getAll( "SELECT id, type_name FROM log_item_types" );
            echo json_encode(array('months'=>$months, 'types'=>$types));
            break;
    }
}