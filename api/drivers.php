<?php
include "helper.php";

if(isset($_GET["type"])){
    switch ($_GET["type"]) {
        case 'driver':
            # Regresar un solo driver
            $driver  = R::findOne( 'drivers', ' id = ? ', [ $_GET['id'] ] );
            $driversArray[] = array('driver'=>$driver);
            echo json_encode($driversArray);
            break;
        case 'drivers':
            # Regresar los drivers segun autocomplete por nombre
            $query = $_GET['term'];
            $driversArray = array();
            $drivers = R::find( 'drivers', ' name LIKE ? OR lastname LIKE ? OR personal_id LIKE ? ORDER BY name ASC', [ $query . '%', $query . '%', $query . '%' ] );
            foreach (array_values($drivers) as $index => $driver) {
                $driversArray[] = array('driver'=>$driver);
            }
            echo json_encode($driversArray);
            break;
        default:
            # Regresar todos los drivers
            $driversArray = array();
            $drivers = R::findAll( 'drivers' );
            foreach (array_values($drivers) as $index => $driver) {
                $driversArray[] = array('driver'=>$driver);
            }
            echo json_encode($driversArray);
            break;
    }
}