<?php
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


echo json_encode($params);;

?>
