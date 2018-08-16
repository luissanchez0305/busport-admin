<?php
include "helper.php";

if(isset($_GET["type"])){
    $type = $_GET["type"];
    switch ($type) {
        case 'driver':
            $driver_id = $_GET['id'];
            $online_id = $_GET['online'];

            # Regresar un solo driver
            $driver  = R::findOne( 'drivers', ' id = ? ', [ $driver_id ] );
            $online =  R::findOne( 'users', ' id = ? ', [ $online_id ] );
            $logs = R::getAll( 'SELECT li.id, u.name, u.last_name, li.description, li.created_date, lit.type_name, lit.points, CASE WHEN li.status THEN 1 ELSE 0 END as status
                FROM log_items li JOIN log_item_types lit ON lit.id = li.log_item_type JOIN users u ON u.id = li.creator_id WHERE li.driver_id = :driver ORDER BY li.created_date',
                [':driver' => $driver_id]
            );
            $files = R::getAll( 'SELECT df.id, ft.name as type_name, df.file_name FROM driver_files df JOIN file_types ft ON ft.id = df.file_type_id WHERE driver_id = :driver',[':driver' => $driver_id]);

            $logTypes = R::getAll( 'SELECT id, type_name, points FROM log_item_types WHERE user_type_id = 3 ORDER BY type_name' );
            $fileTypes = R::getAll( 'SELECT id, name FROM file_types' );
            echo json_encode(array('driver'=>$driver, 'items'=>$logs, 'logTypes'=>$logTypes, 'files'=>$files, 'fileTypes'=>$fileTypes, 'isAdmin'=>($online->user_type_id==1?true:false)));
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
                $driver = R::xdispense( 'drivers' );
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
            $driver->base_bonus = $_GET['baseBonus'];
            $driver->month_bonus = $_GET['monthBonus'];
            $driver->special_bonus = $_GET['specialBonus'];

            $id = R::store( $driver );
            if($type == 'new')
                header("location:/pages-driver.html?id=".$id."&on=new");
            else
                header("location:/pages-driver.html?id=".$driver->id."&on=edit");
            break;
        case 'add-log':
            $driver_id = $_GET["driverId"];
            $log_item = R::xdispense( 'log_items' );
            $log_item->log_item_type = $_GET["log-item-type"];
            $log_item->creator_id = $_GET["user"];
            $log_item->driver_id = $driver_id;
            $log_item->description = $_GET["description"];
            $log_item->created_date = date("Y-m-d H:i:s");
            $log_item->status = true;

            $log_id = R::store($log_item);
            $log = R::getAll( 'SELECT u.name, u.last_name, li.id, li.description, li.created_date, lit.type_name, lit.points, CASE WHEN li.status THEN 1 ELSE 0 END as status FROM log_items li JOIN log_item_types lit ON lit.id = li.log_item_type JOIN users u ON u.id = li.creator_id WHERE li.id = :log ORDER BY li.created_date',
                [':log' => $log_id]
            );
            echo json_encode($log);
            break;
        case 'add-file':
            $file = R::xdispense( 'driver_files' );
            $file->driver_id = $_GET['driver_id'];
            $file->file_type_id = $_GET['file_item_type'];
            $file->user_id = $_GET['user_id'];
            $file->file_name = $_GET['file_name'];
            $_id = R::store($file);
            echo json_encode(array('status'=>'success'));
            break;
        case 'item':
            $item_id = $_GET["id"];
            $action = $_GET["action"];
            $item = R::findOne( 'log_items', ' id = ? ', [ $item_id ] );

            $item->status = $action == 'off' ? 0 : 1;
            $id = R::store( $item );
            echo json_encode(array('status'=>'success'));
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