<?php
    $username = "root";
    $password = "";
    $hostname = "localhost";
    $dbname = "asgmt_movie"; 
    $table_user = "user"; 
    $dbhandler = mysqli_connect($hostname, $username, $password, $dbname)
    or die("Unable to connect to MySQL");
    $selected = mysqli_select_db($dbhandler, $dbname)
    or die("Could not select examples");
    mysqli_set_charset($db_connection, 'UTF8');

    function execute($query_command){
        global $dbhandler;
        $result = mysqli_query($dbhandler, $query_command);
        return $result;
    }

    function login($email, $password){
        global $table_user;
        $query_result = execute("SELECT * FROM $table_user WHERE user_email = \"$email\"");
        if (mysqli_num_rows($query_result) > 0) {
            $user = mysqli_fetch_assoc($query_result);
            if ($user{'password'} == $password){
                http_response_code(200);
                return json_encode(array('is_success' => true, 'message' => "Login successfully!", 'user_type' => $user{'user_type'}));
            }
            else {
                http_response_code(400);
                return json_encode(array('is_success' => false, 'message' => "Wrong email or password (password!)"));
            }
        } 
        else {
            http_response_code(400);
            return json_encode(array('is_success' => false, 'message' => "Wrong email or password (email!)"));
        }
    }

    function register($email, $password){
        global $table_user;
        global $db_connection;
        $query_result = execute("SELECT * FROM $table_user WHERE user_email = \"$email\"");
        if (mysqli_num_rows($query_result) > 0) {
            http_response_code(409);
            return json_encode(array('is_success' => false, 'message' => "Email already exists"));
        } 
        else {
            $success = execute("INSERT INTO $table_user (user_email, password) VALUES ('" . $email . "','" . $password . "')");
            if ($success) {
                http_response_code(400);
                return json_encode(array('is_success' => true, 'message' => "New account has been created"));
            }
            else {
                http_response_code(400);
                return json_encode(array('is_success' => false, 'message' => "Database Error!"));
            }
        }
    }

    switch ($_SERVER['REQUEST_METHOD']){
        case 'GET': 
            $param = json_decode(file_get_contents("php://input"));
            if ($param->email && $param->password){
                echo login($param->email, $param->password); 
            }
            
            break;
        case 'POST':
            $param = json_decode(file_get_contents("php://input"));
            if ($param->email && $param->password){
                echo register($param->email, $param->password); 
            }
            break;
        case 'PUT':
           
            break;
        case 'DELETE':

            break;

        default: echo "404 NOT FOUND!";
    }
?>