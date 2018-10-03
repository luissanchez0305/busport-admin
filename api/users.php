<?php
include "helper.php";

if(isset($_GET["type"])){
    $type = $_GET["type"];
    switch ($type) {
        case 'user':
            $user_id = $_GET['id'];

            # Regresar un solo user
            $user  = R::findOne( 'users', ' id = ? ', [ $user_id ] );
            echo json_encode(array('user'=>$user));
            break;
        case 'save':
        case 'new':
            if($type == 'new'){
                $user = R::xdispense( 'users' );
            }
            else{
                $user = R::findOne( 'users', ' id = ? ', [ $_GET['userId'] ] );
            }
            $user->name = $_GET['firstName'];
            $user->last_name = $_GET['lastName'];
            $user->document_id = $_GET['personalId'];
            $user->phone = $_GET['phone'];
            $user->email = $_GET['email'];
            $user->password = $_GET['pwd'];
            $user->user_type_id = $_GET['userType'];
            $id = R::store( $user );
            if($type == 'new')
                header("location:/pages-user.html?id=".$id."&on=new");
            else
                header("location:/pages-user.html?id=".$user->id."&on=edit");
            break;
        /*case 'driver-dates':
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
            $log_item->custom_points = isset($_GET["log-item-points"]) ? $_GET["log-item-points"] : 0;
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
            break;*/
        default:
            # Regresar todos los users
            $usersArray = array();
            $users = R::findAll( 'users' );
            foreach (array_values($users) as $index => $user) {
                $usersArray[] = array('user'=>$user);
            }
            echo json_encode($usersArray);
            break;
    }
}