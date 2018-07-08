<?php
include "helper.php";

if(isset($_GET["type"])){
    switch ($_GET["type"]) {
        case 'driver':
            # Regresar un solo driver
            break;
        case 'drivers':
            # Regresar los drivers segun autocomplete por nombre
            break;
        default:
            # Regresar todos los drivers
            $driversArray = array();
            $drivers = R::findAll( 'drivers' );
            foreach (array_values($drivers) as $index => $driver) {
                $driversArray[] = array('driver'=>$driver);
            }
            echo json_encode(array('drivers'=>$driversArray));
            break;
    }
}