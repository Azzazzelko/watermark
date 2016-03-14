<?php
session_start();

$project_dir = "../uploadimg/";
$files = scandir($project_dir);

foreach ($files as $key => $value) {
	if(stristr($value, session_id())) {
		unlink($project_dir.$value);
	}
}

?>