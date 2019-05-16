<?php
    $username = "root";
    $password = "";
    $hostname = "localhost";
    $dbname = "asgmt_movie"; 
    $table_user = "user"; 
    $table_otp = "otp"; 
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
        global $table_user, $db_connection;
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

    function generate_OTP($user_id){
        global $table_otp;
        $otp;
        while (true){
            $otp = rand(10000, 99999);
            $t = time() + 5*60;
            $success = execute("INSERT INTO $table_otp (otp_value, otp_user_id, otp_time_out) VALUES ('" . $otp . "','" . $user_id . "','" . $t . "')"); 
            if ($success){
                break;
            }
        }
        return $otp;
    }

    function send_reset_password_email($user_id){
        global $table_user, $table_otp, $db_connection;
        $query_result = execute("SELECT * FROM $table_user WHERE user_id = \"$user_id\"");
        if (mysqli_num_rows($query_result) > 0) {
            $otp = generate_OTP($user_id);
            $to = mysqli_fetch_assoc($query_result)['user_email'];
            ini_set("SMTP","ssl://smtp.gmail.com");
            ini_set("smtp_port","465");
            $to = "hoanglocabcxyzilaksnoifhdnaskhcfea@gmailhihi.com";
            $from = "do-not-reply@watchmovie.com";
            $subject = "Reset password!";
            $message = "Your OTP for reset is: " . $otp;      
            $headers = "From:" . $from;
            $success = mail($to, $subject, $message, $headers);
            if ($success){
                http_response_code(200);
                return json_encode(array('is_success' => true, 'message' => "Email is accepted for delivery!"));
            }
            else {
                http_response_code(400);
                return json_encode(array('is_success' => false, 'message' => "Email is NOT accepted for delivery!"));
            }
        } 
        else {
            http_response_code(404);
            return json_encode(array('is_success' => false, 'message' => "USER Not found!"));
        }
    }

    function reset_password($user_id, $otp, $new_password){
        global $table_user, $table_otp;
        $now = time();
        $query_result = execute("SELECT otp_value FROM $table_otp WHERE otp_time_out >\"$now\" AND otp_user_id = \"$user_id\" ORDER BY otp_time_out DESC");
        if (mysqli_num_rows($query_result) > 0) {
            $saved_otp = mysqli_fetch_assoc($query_result){'otp_value'};
            if ($saved_otp == $otp){
                execute("UPDATE $table_user SET password =  \"$new_password\" WHERE user_id=\"$user_id\"");
                http_response_code(200);
                return json_encode(array('is_success' => true, 'message' => "New password is updated successfully!"));
            }
            else {
                http_response_code(401);
                return json_encode(array('is_success' => false, 'message' => "OTP and User are not match!"));
            }
        } 
        else {
            http_response_code(404);
            return json_encode(array('is_success' => false, 'message' => "OTP not found!"));
        }
    }


    switch ($_SERVER['REQUEST_METHOD']){
        case 'GET': 
            if (isset($_GET["email"]) && isset($_GET["password"])){
                echo login($_GET["email"], $_GET["password"]);
            }
            break;
        case 'POST':
            $param = json_decode(file_get_contents("php://input"));
            if ($param->email && $param->password){
                echo register($param->email, $param->password); 
            }
            break;
        case 'PUT':
            $param = json_decode(file_get_contents("php://input"));
            if ($param->user_id && $param->otp && $param->new_password){
                echo reset_password($param->user_id, $param->otp, $param->new_password);
            }
            else if ($param->user_id){
                echo send_reset_password_email($param->user_id); 
            }
            break;
        case 'DELETE':
            // generate_OTP(2);
            // echo reset_password(2, 32935,"hahahaha");
            break;

        default: echo "404 NOT FOUND!";
    }
?>