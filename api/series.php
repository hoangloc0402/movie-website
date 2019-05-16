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
function returnSeries($row)
{
    $obj = new stdClass();
    $obj->series_id = $row{
        'series_id'};
    $obj->series_name = $row{
        'series_name'};
    $obj->series_thumbnail = $row{
        'series_thumbnail'};
    $obj->series_uploader_id = $row{
        'series_uploader_id'};
    $obj->series_created_date = $row{
        'series_created_date'};
    $obj->is_series = $row{
        'is_series'};
    $obj->series_expected_ep_count = $row{
        'series_expected_ep_count'};
    $obj->series_rating = $row{
        'series_rating'};
    $obj->series_description = $row{
        'series_description'};
    $obj->series_year = $row{
        'series_year'};
    $obj->series_tags = $row{
        'series_tags'};
    return $obj;
}

function getOne($id)
{
    global $dbhandle;
    global $videotable;
    global $seriestable;
    $query_command = "SELECT * FROM $seriestable s 
                        WHERE s.series_id = $id
                            AND s.series_is_active = TRUE";

    $result = mysqli_query($dbhandle, $query_command);

    if (!$result) {
        http_response_code(404);
        exit();
    }

    $row = mysqli_fetch_array($result);
    $obj = returnSeries($row);
    http_response_code(200);
    return json_encode($obj);
}

function getSeries($query_string)
{
    global $dbhandle;
    global $videotable;
    global $seriestable;

    parse_str($query_string, $query_array);

    if (array_key_exists("id", $query_array)) {
        return getOne($query_array{
            "id"});
    }
    $q = "";
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
    if (array_key_exists("q", $query_array)) {
        $q = $query_array{
            "q"};
    }
    $offset = $page * $per_page;
    $temp_per_page = $per_page + 1;
    $query_command = "SELECT * FROM $seriestable s 
                        WHERE s.series_is_active = TRUE AND s.series_name LIKE \"%$q%\"
                        ORDER BY s.series_created_date DESC 
                        LIMIT $offset, $temp_per_page";
    $result = mysqli_query($dbhandle, $query_command);

    if (!$result) {
        http_response_code(400);
        exit();
    }

    $arr = array();
    $counter = 0;
    $has_more = false;
    while ($row = mysqli_fetch_array($result)) {
        $obj = returnSeries($row);
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
    if (!array_key_exists("series_name", $data)) {
        http_response_code(400);
        echo json_encode(array("message" => "A series must have a name."));
        exit();
    }
    $series_name = "\"{$data->series_name}\"";
    $series_uploader_id = $data->series_uploader_id;
    $series_thumbnail = array_key_exists("series_thumbnail", $data) ? "\"{$data->series_thumbnail}\"" : NULL;
    $series_tags = array_key_exists("series_tags", $data) ? "\"" . addslashes(json_encode($data->series_tags)) . "\"" : NULL;
    $is_series = array_key_exists("is_series", $data) ? $data->is_series : NULL;
    $series_expected_ep_count = array_key_exists("series_expected_ep_count", $data) ? $data->series_expected_ep_count : NULL;
    $series_rating = array_key_exists("series_rating", $data) ? $data->series_rating : NULL;
    $series_description = array_key_exists("series_description", $data) ? "\"{$data->series_description}\"" : NULL;
    $series_year = array_key_exists("series_year", $data) ? $data->series_year : NULL;


    $sql_command = "INSERT INTO  $seriestable 
                    (`series_id`, 
                    `series_name`, 
                    `series_uploader_id`, 
                    `series_created_date`, 
                    `is_series`, 
                    `series_expected_ep_count`, 
                    `series_rating`, 
                    `series_description`, 
                    `series_year`, 
                    `series_tags`, 
                    `series_is_active`, 
                    `series_thumbnail`) 
                    VALUES 
                    (NULL, 
                    $series_name,
                    $series_uploader_id, 
                    CURRENT_TIMESTAMP,
                    $is_series,
                    $series_expected_ep_count,
                    $series_rating,
                    $series_description,
                    $series_year,
                    $series_tags,
                    '1',
                    $series_thumbnail);";

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
    $sql = "UPDATE $seriestable SET ";
    $let_update = false;
    foreach ($data as $key => $value) {
        if ($key == "series_name" || $key == "series_uploader_id" || $key == "series_thumbnail" || $key == "series_expected_ep_count" || $key == "series_rating"  || $key == "series_description" || $key == "series_year" || $key == "series_tags") {
            if ($let_update) {
                $sql .= ",";
            }
            if ($key == "series_tags") {
                $sql .= " $key = " . "\"" . addslashes(json_encode($data->series_tags)) . "\"" . " ";
            } else
            if ($key == "series_uploader_id" || $key == "series_expected_ep_count" || $key == "series_rating" || $key == "series_year") {
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
    $sql .= " WHERE $seriestable.series_id = $id";

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

    $id = $query_array{
        "id"};

    $query_command = "DELETE FROM $seriestable
                        WHERE $seriestable.series_id = $id";

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
        echo getSeries($_SERVER['QUERY_STRING']);
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
