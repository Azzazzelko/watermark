<?php
$filename = '';
if (isset($_GET['file'])) $filename = $_GET['file'];

$filename_path  = "../uploadimg/".$filename;

if (file_exists($filename_path)) {
        header("Content-type: application/x-download");
        header("Content-Disposition: attachment; filename=$filename");
        readfile($filename_path);
} else { header("HTTP/1.1 404 Not Found"); echo '404 Not Found'.$filename; }

?>