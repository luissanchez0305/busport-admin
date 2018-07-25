<?php
include "helper.php";

if(isset($_GET["type"])){
    $type = $_GET["type"];
    switch ($type) {
        case 'driver':
            # Regresar un solo driver
            $driver  = R::findOne( 'drivers', ' id = ? ', [ $_GET['id'] ] );
            echo json_encode($driver);
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
        case 'save':
        case 'new':
            if($type == 'new'){
                $driver = R::dispense( 'drivers' );
            }
            else{
                $driver = R::findOne( 'drivers', ' id = ? ', [ $_GET['driverId'] ] );
            }
            $driver->name = $_GET['firstName'];
            $driver->lastname = $_GET['lastName'];
            $driver->nickname = $_GET['nickName'];
            $driver->personal_id = $_GET['personalId'];
            $driver->licencia = $_GET['licenceNumber'];
            $driver->blood_type = $_GET['bloodType'];
            $driver->contact_phone = $_GET['phone'];
            $driver->licencia_expiration = $_GET['expirationDate'];
            $driver->start_date = $_GET['startDate'];
            $driver->finish_date = $_GET['finishDate'] == NULL ? null : $_GET['finishDate'];
            $driver->address = $_GET['address'];
            $driver->licencia_puntos = $_GET['licensePoints'] == NULL ? null : $_GET['licensePoints'];
            $driver->size_pants = $_GET['sizePants'] == NULL ? null : $_GET['sizePants'];
            $driver->size_shirt = $_GET['sizeShirt'];
            $driver->size_shoes = $_GET['sizeShoes'];
            $driver->email = $_GET['email'];
            $driver->emergency_name = $_GET['contactName'];
            $driver->emergency_relation = $_GET['contactRelation'];
            $driver->emergency_phone = $_GET['contactPhone'];

            R::store( $driver );
            if($type == 'new')
                header("location:/pages-drivers.html?on=new");
            else
                header("location:/pages-drivers.html?on=edit");
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