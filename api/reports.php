<?php
include "helper.php";

if(isset($_GET["type"])){
    $type = $_GET["type"];
    switch ($type) {
        case 'table':
            $infractions = $_GET['infractions'];
            if($infractions){
                $query = "SELECT CONCAT(d.name, ' ', d.lastname) AS name, lit.type_name, d.base_bonus, d.month_bonus, d.special_bonus, COUNT(*) as number, SUM(li.custom_points) AS total
                FROM drivers d
                JOIN log_items li ON d.id = li.driver_id
                JOIN log_item_types lit ON lit.id = li.log_item_type
                WHERE (li.status = 1 AND li.log_item_type IN ($infractions) AND li.log_date >= ':start_date' AND li.log_date <= ':end_date' :where_driver) /*:all_users*/
                GROUP BY d.name, lit.type_name, d.base_bonus, d.month_bonus, d.special_bonus
                ORDER BY d.name, lit.type_name";
                $end_date = new DateTime($_GET['final_date']);
                $end_date->modify('+1 day');
                $query = str_replace(':end_date', $end_date->format('Y-m-d'), str_replace(':start_date', $_GET['init_date'], $query));
                if($_GET['driver'] != '-1'){
                    $query = str_replace(':where_driver', 'AND li.driver_id = ' . $_GET['driver'], $query);
                    //$query = str_replace(':all_users', '', $query);
                }
                else{
                    $query = str_replace(':where_driver', '', $query);
                    //$query = str_replace(':all_users', 'OR li.id IS NULL OR li.status = 0', $query);
                }
                $logs = R::getAll( $query );
                echo json_encode(array('query' => $query, 'logs'=>$logs));
            }
            break;
        case 'line':
            $init_date = $_GET['init_date'];
            $final_date = $_GET['final_date'];
            $log_type = $_GET['log_type'];
            $log_counts = R::getAll( "SELECT DATE_FORMAT(li.log_date,'%Y-%m') AS date, COUNT(*) AS number
                FROM log_items li
                JOIN log_item_types lit ON lit.id = li.log_item_type
                WHERE li.status = 1 AND log_date >= :init_date AND log_date <= :final_date AND li.log_item_type = :log_type
                GROUP BY lit.type_name, DATE_FORMAT(li.log_date,'%Y-%m')",
                [':init_date' => $init_date, ':final_date' => $final_date, ':log_type' => $log_type]
            );
            echo json_encode(array('log_counts'=>$log_counts));
            break;
        default:
            $months = R::getAll( "SELECT DATE_FORMAT(log_date,'%Y-%m') AS date FROM log_items GROUP BY DATE_FORMAT(log_date,'%Y-%m') ORDER BY log_date");
            $types  = R::getAll( "SELECT id, type_name, points FROM log_item_types WHERE user_type_id = 3 ORDER BY type_name" );
            echo json_encode(array('months'=>$months, 'types'=>$types));
            break;
    }
}