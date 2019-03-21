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
            $logs = R::getAll( 'SELECT li.id, u.name, u.last_name, li.description, li.created_date, lit.type_name, li.custom_points, li.is_bonus, CASE WHEN li.status THEN 1 ELSE 0 END as status
                FROM log_items li JOIN log_item_types lit ON lit.id = li.log_item_type JOIN users u ON u.id = li.creator_id WHERE li.driver_id = :driver ORDER BY li.created_date',
                [':driver' => $driver_id]
            );
            $certifications = R::getAll( 'SELECT dc.id, ct.name as type_name, dc.certification_date, dc.description FROM driver_certifications dc JOIN certification_types ct ON ct.id = dc.certification_type_id WHERE driver_id = :driver',[':driver' => $driver_id]);
            $files = R::getAll( 'SELECT df.id, ft.name as type_name, df.file_name, df.description, df.file_type_id FROM driver_files df JOIN file_types ft ON ft.id = df.file_type_id WHERE driver_id = :driver',[':driver' => $driver_id]);

            $logTypes = R::getAll( 'SELECT id, type_name, points, CASE WHEN substract_points THEN 1 ELSE 0 END as substract_points FROM log_item_types WHERE user_type_id = 3 ORDER BY type_name' );
            $fileTypes = R::getAll( 'SELECT id, name, CASE WHEN show_description THEN 1 ELSE 0 END AS show_description FROM file_types' );
            $certTypes = R::getAll( 'SELECT id, name, CASE WHEN show_description THEN 1 ELSE 0 END AS show_description FROM certification_types WHERE entry_certification = 0' );

            $drivers = R::findAll( 'drivers', " ORDER BY CONCAT(name, ' ', lastname)" );
            $driversArray = array_values($drivers);
            foreach ($driversArray as $index => $driverItem) {
                if($driverItem->id == $driver_id){
                    if($index - 1 >= 0)
                        $prevDriver = $driversArray[$index - 1];
                    if($index + 1 < sizeof($driversArray))
                        $nextDriver = $driversArray[$index + 1];
                }
            }


            echo json_encode(array('prevDriver'=>$prevDriver, 'nextDriver'=>$nextDriver, 'driver'=>$driver, 'items'=>$logs, 'logTypes'=>$logTypes, 'certifications' => $certifications, 'files'=>$files, 'fileTypes'=>$fileTypes, 'certificationTypes'=> $certTypes, 'isAdmin'=>($online->user_type_id == 1 ? true : false)));
            break;
        case 'driver-dates':
            $driver_id = $_GET['id'];
            $online_id = $_GET['online'];

            $date_initial = $_GET['init_date'];
            $date_final = $_GET['final_date'];

            if($date_initial && $date_final){
                $logs = R::getAll( 'SELECT li.id, u.name, u.last_name, li.description, li.created_date, lit.type_name, li.custom_points, lit.points AS log_type_points, CASE WHEN li.status THEN 1 ELSE 0 END as status
                    FROM log_items li JOIN log_item_types lit ON lit.id = li.log_item_type JOIN users u ON u.id = li.creator_id WHERE li.driver_id = :driver AND li.created_date >= :date_initial AND li.created_date <= :date_final ORDER BY li.created_date',
                    [':driver' => $driver_id, ':date_initial' => $date_initial, ':date_final' => $date_final]
                );            }
            else
            {
                $logs = R::getAll( 'SELECT li.id, u.name, u.last_name, li.description, li.created_date, lit.type_name, li.custom_points, lit.points AS log_type_points, CASE WHEN li.status THEN 1 ELSE 0 END as status
                    FROM log_items li JOIN log_item_types lit ON lit.id = li.log_item_type JOIN users u ON u.id = li.creator_id WHERE li.driver_id = :driver ORDER BY li.created_date',
                    [':driver' => $driver_id]
                );
            }
            $driver  = R::findOne( 'drivers', ' id = ? ', [ $driver_id ] );
            $online =  R::findOne( 'users', ' id = ? ', [ $online_id ] );
            echo json_encode(array('driver'=>$driver, 'isAdmin'=>($online->user_type_id == 1 ? true : false), 'items'=>$logs));
            break;
        case 'status':
                $action = $_GET['action'];
                $driver = R::findOne( 'drivers', ' id = ? ', [ $_GET['id'] ] );
                $driver->active_status = ($action === 'on' ? 1 : ($action == 'standby' ? 2 : 0));
                $id = R::store( $driver );
                echo json_encode(array('status'=>'success', 'action'=> $action));
            break;
        case 'drivers':
            # Regresar los drivers segun autocomplete por nombre
            $query = $_GET['term'];
            $driversArray = array();
            $drivers = R::find( 'drivers', ' name LIKE ? OR lastname LIKE ? OR personal_id LIKE ? ORDER BY name ASC', [ '%' . $query . '%', '%' . $query . '%', '%' . $query . '%' ] );
            foreach (array_values($drivers) as $index => $driver) {
                $driversArray[] = array('driver'=>$driver);
            }
            echo json_encode($driversArray);
            break;
        case 'drivers-status':
            $action = $_GET['action'];
            $driversArray = array();
            if($action != '-1')
                $drivers = R::find( 'drivers', ' active_status = ? ORDER BY name ASC', [ $action ] );
            else
                $drivers = R::findAll( 'drivers' );
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
            $driver->social_security_number = $_GET['socialSecurity'];
            $driver->licencia = $_GET['licenceNumber'];
            $driver->blood_type = $_GET['bloodType'];
            $driver->contact_phone = $_GET['phone'];
            $driver->busport_phone = $_GET['bp-phone'];
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
            $driver->emergency_name2 = $_GET['contactName2'];
            $driver->emergency_relation2 = $_GET['contactRelation2'];
            $driver->emergency_phone2 = $_GET['contactPhone2'];
            $driver->base_bonus = $_GET['baseBonus'];
            $driver->month_bonus = $_GET['monthBonus'];
            $driver->special_bonus = $_GET['specialBonus'];
            $driver->active_status = $_GET['activestatus'];
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
            $log_item->custom_points = $_GET["log-item-points"];
            $log_item->status = true;

            $log_id = R::store($log_item);
            $log = R::getAll( 'SELECT u.name, u.last_name, li.id, li.description, li.created_date, li.custom_points, CASE WHEN lit.substract_points THEN 1 ELSE 0 END as substract_points, lit.type_name, lit.points AS log_type_points, CASE WHEN li.status THEN 1 ELSE 0 END as status FROM log_items li JOIN log_item_types lit ON lit.id = li.log_item_type JOIN users u ON u.id = li.creator_id WHERE li.id = :log ORDER BY li.created_date',
                [':log' => $log_id]
            );
            echo json_encode($log);
            break;
        case 'induction':
                $file = R::findOne( 'driver_files', ' driver_id = ? AND file_type_id = ? ', array($_GET['id'], $_GET['file_type_id'] ) );

                echo json_encode(array('status'=>'success', 'id'=>$file->id));
            break;
        case 'add-certification':
            $certification = R::xdispense( 'driver_certifications' );
            $certification->driver_id = $_GET['driver_id'];
            $certification->user_id = $_GET['user_id'];
            $certification->certification_type_id = $_GET['certification_type'];
            $certification->description = $_GET['certification_description'];
            $certification->certification_date = $_GET['certification_date'];
            $_id= R::store($certification);
            echo json_encode(array('status'=>'success', 'id' => $_id));
            break;
        case 'add-file':
            $file = R::xdispense( 'driver_files' );
            $file->driver_id = $_GET['driver_id'];
            $file->file_type_id = $_GET['file_item_type'];
            $file->user_id = $_GET['user_id'];
            $file->file_name = $_GET['file_name'];
            $file->description = $_GET['file_description'];
            $_id = R::store($file);
            echo json_encode(array('status'=>'success', 'id'=>$_id));
            break;
        case 'delete-certification':
            $driver_certification = R::findOne( 'driver_certifications', ' id = ? ', [ $_GET['certificationId'] ] );
            R::trash( $driver_certification ); //for one driver file
            echo json_encode(array('status'=>'success'));
            break;
        case 'delete-file':
            $driver_file = R::findOne( 'driver_files', ' id = ? ', [ $_GET['fileId'] ] );
            R::trash( $driver_file ); //for one driver file
            echo json_encode(array('status'=>'success'));
            break;
        case 'log-update-status':
            $item_id = $_GET["id"];
            $action = $_GET["action"];
            $item = R::findOne( 'log_items', ' id = ? ', [ $item_id ] );

            $item->status = $action == 'off' ? 0 : 1;
            $id = R::store( $item );
            echo json_encode(array('status'=>'success'));
            break;
        case 'log-item':
            $log_item_id = $_GET["id"];
            $item = R::getAll( 'SELECT li.id, u.name, u.last_name, li.description, li.created_date, lit.type_name FROM log_items li JOIN log_item_types lit ON lit.id = li.log_item_type JOIN users u ON u.id = li.creator_id WHERE li.id = :log_item_id ORDER BY li.created_date', [':log_item_id' => $log_item_id] );
            echo json_encode(array('log_item'=>$item));
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