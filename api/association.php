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
    $obj->video_thumbnail = is_null($row{
        'video_thumbnail'}) ? $row{
        'series_thumbnail'} : $row{
        'video_thumbnail'};
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

    return $obj;
}

function getVideo($query_array, $only_first)
{
    global $dbhandle;
    global $videotable;
    global $seriestable;

    $id = $query_array{
        "series_id"};
    $page = 0;
    $per_page = 20;
    if ($only_first) {
        $page = 0;
        $per_page = 1;
    } else {
        if (array_key_exists("page", $query_array)) {
            $page = $query_array{
                "page"};
        }
        if (array_key_exists("per_page", $query_array)) {
            $per_page = $query_array{
                "per_page"};
        }
    }
    $offset = $page * $per_page;
    $temp_per_page = $per_page + 1;
    $query_command = "SELECT * FROM $videotable v 
                        JOIN $seriestable s 
                        ON v.video_series_id = s.series_id 
                        WHERE s.series_id = $id
                            AND v.video_is_active = TRUE 
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

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        parse_str($_SERVER['QUERY_STRING'], $query_array);
        if (array_key_exists("series_id", $query_array)) {
            if (array_key_exists("get_all", $query_array)) {
                echo getVideo($query_array, false);
            } else
        if (array_key_exists("get_first", $query_array)) {
                echo getVideo($query_array, true);
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "You must include a query type"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "You must include a series id"));
        }
        break;
}

mysqli_close($dbhandle);
