<?php
$username = "root";
$password = "";
$hostname = "localhost";
$dbname = "asgmt_movie";
$videotable = "video";
$seriestable = "series";
$dbhandle = mysqli_connect($hostname, $username, $password, $dbname)
    or die("Unable to connect to MySQL");

$selected = mysqli_select_db($dbhandle, "asgmt_movie")
    or die("Could not select examples");

mysqli_set_charset($dbhandle, 'UTF8');

function returnVideo($row)
{
    $obj = new stdClass();
    $obj->video_id = $row{
        'video_id'};
    $obj->video_name = $row{
        'video_name'};
    $obj->video_series_id = $row{
        'video_series_id'};
    $obj->video_thumbnail = is_null($row{'video_thumbnail'}) ? $row{'series_thumbnail'} : $row{'video_thumbnail'};
    $obj->video_source = $row{
        'video_source'};
    $obj->video_uploader_id = $row{
        'video_uploader_id'};
    $obj->video_upload_time = $row{
        'video_upload_time'};
    $obj->video_episode = $row{
        'video_episode'};
    $obj->series_name = $row{
        'series_name'};
    $obj->series_uploader_id = $row{
        'series_uploader_id'};
    $obj->series_description = $row{
        'series_description'};
    $obj->is_series = $row{
        'is_series'};

    return $obj;
}

function getOne($id)
{
    global $dbhandle;
    global $videotable;
    global $seriestable;
    $query_command = "SELECT * FROM $videotable v 
                        JOIN $seriestable s 
                        ON v.video_series_id = s.series_id 
                        WHERE v.video_id = $id
                            AND v.video_is_active = TRUE 
                            AND s.series_is_active = TRUE";

    $result = mysqli_query($dbhandle, $query_command);

    if (!$result) {
        http_response_code(404);
        exit();
    }

    $row = mysqli_fetch_array($result);
    $obj = returnVideo($row);
    http_response_code(200);
    return json_encode($obj);
}

function getVideo($query_string)
{
    global $dbhandle;
    global $videotable;
    global $seriestable;

    parse_str($query_string, $query_array);

    if (array_key_exists("id", $query_array)) {
        return getOne($query_array{
            "id"});
    }

    $page = 0;
    $per_page = 20;
    if (array_key_exists("page", $query_array)) {
        $page = $query_array{
            "page"};
    }
    if (array_key_exists("per_page", $query_array)) {
        $per_page = $query_array{
            "per_page"};
    }
    $offset = $page * $per_page;
    $temp_per_page = $per_page + 1;
    $query_command = "SELECT * FROM $videotable v 
                        JOIN $seriestable s 
                        ON v.video_series_id = s.series_id 
                        WHERE v.video_is_active = TRUE 
                            AND s.series_is_active = TRUE 
                        ORDER BY v.video_upload_time DESC 
                        LIMIT $offset, $temp_per_page";
    // echo($query_command);
    $result = mysqli_query($dbhandle, $query_command);

    if (!$result) {
        http_response_code(400);
        exit();
    }

    $arr = array();
    $counter = 0;
    $has_more = false;
    while ($row = mysqli_fetch_array($result)) {
        $obj = returnVideo($row);
        $counter += 1;
        if ($counter <= $per_page) {
            array_push($arr, $obj);
        } else {
            $has_more = true;
        }
    }
    http_response_code(200);
    return json_encode(array("result" => $arr, "has_more" => $has_more));
}

function insertVideo($data)
{
    global $dbhandle;
    global $videotable;
    global $seriestable;
    if (!array_key_exists("video_series_id", $data)) {
        http_response_code(400);
        echo json_encode(array("message" => "A video must be associated with a series."));
        exit();
    }
    if (!array_key_exists("video_name", $data)) {
        http_response_code(400);
        echo json_encode(array("message" => "A video must have a name."));
        exit();
    }
    if (!array_key_exists("video_source", $data)) {
        http_response_code(400);
        echo json_encode(array("message" => "A video must have a source."));
        exit();
    }
    if (!array_key_exists("video_uploader_id", $data)) {
        http_response_code(400);
        echo json_encode(array("message" => "A video must be associated with a admin."));
        exit();
    }
    $video_name = "'{$data->video_name}'";
    $video_series_id = $data->video_series_id;
    $video_thumbnail = array_key_exists("video_thumbnail", $data) ? "'{$data->video_thumbnail}'" : "NULL";
    $video_source = "'{$data->video_source}'";
    $video_episode = array_key_exists("video_episode", $data) ? $data->video_episode : "NULL";
    $video_uploader_id = $data->video_uploader_id;

    $sql_command = "INSERT INTO  $videotable 
                    (`video_id`,
                     `video_name`,
                     `video_series_id`, 
                     `video_thumbnail`, 
                     `video_source`, 
                     `video_uploader_id`, 
                     `video_upload_time`, 
                     `video_episode`, 
                     `video_is_active`) 
                    VALUES 
                    (NULL, 
                    $video_name,
                    $video_series_id, 
                    $video_thumbnail,
                    $video_source,
                    $video_uploader_id,
                    CURRENT_TIMESTAMP,
                    $video_episode,
                    '1');";
    $result = mysqli_query($dbhandle, $sql_command);

    if (!$result) {
        http_response_code(400);
        echo json_encode(array("message" => "Something when wrong."));
        exit();
    } else {
        $resp = new stdClass();
        $resp->id = mysqli_insert_id($dbhandle);
        $resp->message = "Inserted";
        echo json_encode($resp);
    }
}

function modifyVideo($query_string, $data)
{
    global $dbhandle;
    global $videotable;
    global $seriestable;

    parse_str($query_string, $query_array);
    if (!array_key_exists("id", $query_array)) {
        http_response_code(400);
        echo json_encode(array("message" => "You have to provide a id."));
        exit();
    }
    $id = $query_array{
        "id"};
    $sql = "UPDATE $videotable SET ";
    $let_update = false;
    foreach ($data as $key => $value) {
        if ($key == "video_name" || $key == "video_series_id" || $key == "video_thumbnail" || $key == "video_source" || $key == "video_uploader_id" || $key == "video_episode") {
            if ($let_update) {
                $sql .= ",";
            }
            if ($key == "video_series_id" || $key == "video_uploader_id" || $key == "video_episode") {
                $sql .= " $key = " . $value . " ";
            } else {
                $sql .= " $key = \"" . $value . "\"";
            }
            $let_update = true;
        }
    }
    if (!$let_update) {
        http_response_code(400);
        echo json_encode(array("message" => "Don't recoginze any of your prop."));
        exit();
    }
    $sql .= " WHERE $videotable.video_id = $id";

    $result = mysqli_query($dbhandle, $sql);

    if (!$result) {
        http_response_code(400);
        echo json_encode(array("message" => "Something when wrong."));
        exit();
    } else {
        $resp = new stdClass();
        $resp->id = $id;
        $resp->message = "Updated";
        echo json_encode($resp);
    }
}

function deleteVideo($query_string)
{
    global $dbhandle;
    global $videotable;
    global $seriestable;

    parse_str($query_string, $query_array);

    if (!array_key_exists("id", $query_array)) {
        http_response_code(400);
        echo json_encode(array("message" => "You have to provide a id."));
        exit();
    }

    $id = $query_array{"id"};

    $query_command = "DELETE FROM $videotable
                        WHERE $videotable.video_id = $id"; 

    $result = mysqli_query($dbhandle, $query_command);

    if (!$result) {
        http_response_code(400);
        echo json_encode(array("message" => "Something when wrong."));
        exit();
    } else {
        $resp = new stdClass();
        $resp->id = $id;
        $resp->message = "Deleted";
        echo json_encode($resp);
    }
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        echo getVideo($_SERVER['QUERY_STRING']);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        echo insertVideo($data);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        echo modifyVideo($_SERVER['QUERY_STRING'], $data);
        break;
    case 'DELETE':
        echo deleteVideo($_SERVER['QUERY_STRING']);
        break;
}

mysqli_close($dbhandle);
