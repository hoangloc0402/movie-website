<?php
    $username = "root";
    $password = "";
    $hostname = "localhost";
    $dbname = "asgmt_movie"; 
    $table_user = "user"; 
    $table_comment = "comment";
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

    function get_comment($video_id){
        global $table_user;
        global $table_comment;
        global $db_connection;
        $query_result = execute("SELECT * FROM $table_user JOIN $table_comment ON user_id = comment_user_id WHERE comment_video_id = \"$video_id\" AND user_is_active=true AND comment_is_active=true");
        $return_data = array();
        if (mysqli_num_rows($query_result) > 0) {
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

    function add_new_comment($video_id, $user_id, $comment_detail){
        global $table_comment;
        $success = execute("INSERT INTO $table_comment (comment_video_id, comment_user_id, comment_detail) VALUES ('" . $video_id . "','" . $user_id . "','" . $comment_detail . "')");
        if ($success) {
            http_response_code(400);
            return json_encode(array('is_success' => true, 'message' => "New comment has been saved"));
        }
        else {
            http_response_code(400);
            return json_encode(array('is_success' => false, 'message' => "Database Error!"));
        }
    }

    function deactive_comment($comment_id){
        global $table_comment;
        global $db_connection;
        $success = execute("UPDATE $table_comment SET comment_is_active = false WHERE comment_id = \"$comment_id\"");
        if (!$success){
            http_response_code(500);
            return json_encode(array('is_success' => false, 'message' => 'Error occured while deleting comment!'));
        }
        if (mysqli_affected_rows($db_connection) == 1) {
            http_response_code(200);
            return json_encode(array('is_success' => true, 'message' => 'Comment is deactived!'));
        }
        else {
            http_response_code(400);
            return json_encode(array('is_success' => true, 'message' => 'No information is changed!'));
        }
    }

    
    switch ($_SERVER['REQUEST_METHOD']){
        case 'GET': 
            parse_str($_SERVER['QUERY_STRING'], $param );
            if (array_key_exists("video_id", $param)){
                echo get_comment($param{
                    "video_id"});
            }
            break;
        case 'POST':
            $param = json_decode(file_get_contents("php://input"));
            if ($param->video_id && $param->user_id && $param->comment_detail){
                echo add_new_comment($param->video_id, $param->user_id, $param->comment_detail);
            }
            break;
        case 'PUT':
            
        case 'DELETE':
            $param = json_decode(file_get_contents("php://input"));
            if ($param->comment_id){
                echo deactive_comment($param->comment_id);
            }
            break;

        default: echo "404 NOT FOUND!";
    }
