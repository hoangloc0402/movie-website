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
                execute("UPDATE $table_user SET user_last_login = CURRENT_TIMESTAMP WHERE user_email=\"$email\"");
                return json_encode(array('is_success' => true, 'message' => "Login successfully!", 'user_type' => $user{'user_type'}, 'user_id' => $user{'user_id'}));
            }
            else {
                http_response_code(400);
                return json_encode(array('is_success' => false, 'message' => "Wrong email or password!"));
            }
        } 
        else {
            http_response_code(400);
            return json_encode(array('is_success' => false, 'message' => "Wrong email or password!"));
        }
    }

    function register($email, $password, $display_name){
        global $table_user, $db_connection;
        $query_result = execute("SELECT * FROM $table_user WHERE user_email = \"$email\"");
        if (mysqli_num_rows($query_result) > 0) {
            http_response_code(409);
            return json_encode(array('is_success' => false, 'message' => "Email already exists"));
        } 
        else {
            $success = execute("INSERT INTO $table_user (user_email, password, user_name) VALUES ('" . $email . "','" . $password . "','" . $display_name. "')");
            if ($success) {
                http_response_code(200);
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

    function send_reset_password_email($email){
        global $table_user, $table_otp, $db_connection;
        $query_result = execute("SELECT * FROM $table_user WHERE user_email = \"$email\"");
        if (mysqli_num_rows($query_result) > 0) {
            $otp = generate_OTP(mysqli_fetch_assoc($query_result)['user_id']);
            ini_set("SMTP","ssl://smtp.gmail.com");
            ini_set("smtp_port","465");
            $from = "do-not-reply@watchmovie.com";
            $subject = "Reset password!";
            $message = "Your OTP for reset is: " . $otp;      
            $headers = "From:" . $from;
            $success = mail($email, $subject, $message, $headers);
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
            return json_encode(array('is_success' => false, 'message' => "Email has not been registered!"));
        }
    }

    function reset_password($email, $otp, $new_password){
        global $table_user, $table_otp;
        $now = time();
        $query_result = execute("SELECT otp_value FROM $table_otp JOIN $table_user ON otp_user_id=user_id WHERE otp_time_out >\"$now\" AND user_email = \"$email\" ORDER BY otp_time_out DESC");
        if (mysqli_num_rows($query_result) > 0) {
            $saved_otp = mysqli_fetch_assoc($query_result){'otp_value'};
            if ($saved_otp == $otp){
                execute("UPDATE $table_user SET password =  \"$new_password\" WHERE user_email=\"$email\"");
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
            break;
        case 'POST':
            $param = json_decode(file_get_contents("php://input"));
            if (isset($param->email) && isset($param->password)){
                if ($param->type=="login"){
                    echo login($param->email, $param->password);
                } else {
                    echo register($param->email, $param->password, $param->display_name);
                }
            }
            break;
        case 'PUT':
            $param = json_decode(file_get_contents("php://input"));
            if (isset($param->email) && isset($param->otp) && isset($param->new_password)){
                echo reset_password($param->email, $param->otp, $param->new_password);
            }
            else if (isset($param->email)){
                echo send_reset_password_email($param->email); 
            }
            break;
        case 'DELETE':
            // echo reset_password(2, 32935,"hahahaha");
            break;

        default: echo "404 NOT FOUND!";
    }
?>