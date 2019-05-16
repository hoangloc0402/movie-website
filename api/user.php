<?php
    $username = "root";
    $password = "";
    $hostname = "localhost";
    $dbname = "asgmt_movie"; 
    $table_user = "user"; 
    $db_connection = mysqli_connect($hostname, $username, $password, $dbname)
    or die("Unable to connect to MySQL");
    $selected = mysqli_select_db($db_connection, $dbname)
    or die("Could not select examples");
    mysqli_set_charset($db_connection, 'UTF8');

    function execute($query_command){
        global $db_connection;
        $result = mysqli_query($db_connection, $query_command);
        return $result;
    }

    function get_all_user($page, $per_page){
        global $table_user;
        $query_result = execute("SELECT * FROM $table_user WHERE user_is_active=true LIMIT $page, $per_page");
        if (mysqli_num_rows($query_result) > 0) {
            $return_data = array();
            while($row = mysqli_fetch_assoc($query_result)) {
                array_push($return_data, $row);
            }
            http_response_code(200);
            return json_encode(array('is_success' => true, 'data' => $return_data));
        } 
        else {
            http_response_code(404);
            return json_encode(array('is_success' => false));
        }
    }

    function get_user($user_id){
        global $table_user;
        $return_data = array();
        $query_result = execute("SELECT * FROM $table_user WHERE user_id = \"$user_id\"");
        if (mysqli_num_rows($query_result) > 0) {
            $user = mysqli_fetch_assoc($query_result); 
            unset($user['user_password']);
            http_response_code(200);
            return json_encode(array('is_success' => true, 'data' => $user));
        }
        else {
            http_response_code(404);
            return json_encode(array('is_success' => false));
        }
    }

    function update_user_info($user_id, $user_profile_image){
        global $table_user;
        global $db_connection;
        $success = execute("UPDATE $table_user SET user_profile_image = \"$user_profile_image\" WHERE user_id = \"$user_id\"");
        if (!$success){
            http_response_code(500);
            return json_encode(array('is_success' => false, 'message' => 'Error occured while updating!'));
        }

        if (mysqli_affected_rows($db_connection) > 0) {
            http_response_code(200);
            return json_encode(array('is_success' => true, 'message' => 'User information is updated successfully!'));
        }
        else {
            http_response_code(400);
            return json_encode(array('is_success' => true, 'message' => 'No information is changed!'));
        }
    }

    function deactive_user($user_id){
        global $table_user;
        global $db_connection;
        $success = execute("UPDATE $table_user SET user_is_active = false WHERE user_id = \"$user_id\"");
        if (!$success){
            http_response_code(500);
            return json_encode(array('is_success' => false, 'message' => 'Error occured while deleting user!'));
        }
        if (mysqli_affected_rows($db_connection) == 1) {
            http_response_code(200);
            return json_encode(array('is_success' => true, 'message' => 'User is deactived!'));
        }
        else {
            http_response_code(400);
            return json_encode(array('is_success' => true, 'message' => 'No information is changed!'));
        }
    }

    switch ($_SERVER['REQUEST_METHOD']){
        case 'GET': 
            $user_id = $_GET["user_id"];
            if (is_null($user_id)){
                $page = $_GET["page"] ? $_GET["page"] : 0;
                $per_page = $_GET["per_page"] ? $_GET["per_page"] : 15;
                echo get_all_user($page, $per_page);
            }
            else {
                echo get_user($user_id);
            }
            break;
        case 'POST':

            break;
        case 'PUT':
            $param = json_decode(file_get_contents("php://input"));
            if ($param->user_id && $param->user_profile_image){
                echo update_user_info($param->user_id, $param->user_profile_image);
            }
            break;
        case 'DELETE':
            $param = json_decode(file_get_contents("php://input"));
            if ($param->user_id){
                echo deactive_user($param->user_id);
            }
            break;

        default: echo "404 NOT FOUND!";
    }
?>