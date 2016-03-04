<?php

// этими данными можно пользоваться в скрипте
$params = array(
    "imgUrl" => $_POST["imgUrl"],
    "imgAbsWidth" => $_POST["imgAbsWidth"],
    "imgAbsHeight" => $_POST["imgAbsHeight"],
    "imgRelWidth" => $_POST["imgRelWidth"],
    "imgRelHeight" => $_POST["imgRelHeight"],
    "imgTop" => $_POST["imgTop"],
    "imgLeft" => $_POST["imgLeft"],

    "markUrl" => $_POST["markUrl"],
    "markAbsWidth" => $_POST["markAbsWidth"],
    "markAbsHeight" => $_POST["markAbsHeight"],
    "markRelWidth" => $_POST["markRelWidth"],
    "markRelHeight" => $_POST["markRelHeight"],
    "markTop" => $_POST["markTop"],
    "markLeft" => $_POST["markLeft"]
);

// для проверки
//echo json_encode($params);

$filename = '';
if (isset($_GET['file'])) $filename = $_GET['file'];

$filename_path  = "../uploadimg/".$filename;

if (file_exists($filename_path)) {
        header("Content-type: application/x-download");
        header("Content-Disposition: attachment; filename=$filename");
        readfile($filename);
} else { header("HTTP/1.1 404 Not Found"); echo '404 Not Found'.$filename; }

?>