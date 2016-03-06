<?php
session_start();

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

include('ac_image_class.php');
$uploadimg_dir = "../uploadimg/";
$opacity = 100;
// Установка полей для штампа и получение высоты/ширины штампа
$x_margin = 100;
$y_margin = 100;
$x = 0; 
$y = 0;
$view = "one"; // режим расположения марки

$img_tmp_name = session_id().'-background-tmp';
$mark_tmp_name = session_id().'-watermark-tmp';
$result_name = session_id().'-result.png';

$img_tmp_obj = new acResizeImage('../'.$params['imgUrl']);
$img_tmp_obj ->save($uploadimg_dir, $img_tmp_name, 'png', true);

$mark_tmp_obj = new acResizeImage('../'.$params['markUrl']);
if ($params['markAbsWidth'] > $params['imgAbsWidth'] || 
	$params['markAbsHeight'] > $params['imgAbsHeight'] ) {
	$mark_tmp_obj->resize($params['imgAbsWidth'], $params['imgAbsHeight']);
}
$mark_tmp_obj ->save($uploadimg_dir, $mark_tmp_name, 'png', true);

$background_img = imagecreatefrompng($uploadimg_dir.$img_tmp_name.'.png');
$watermark_img = imagecreatefrompng($uploadimg_dir.$mark_tmp_name.'.png');

$sx = imagesx($watermark_img); // Ширина водяного знака
$sy = imagesy($watermark_img); // Высота водяного знака

// Копирование изображения водяного знака на фотографию с помощью смещения края
if ($view == "one") {
	imagecopymerge($background_img, $watermark_img , $x, $y, 0, 0, $sx , $sy, $opacity);
	//header('Content-type: image/png');
	imagepng($background_img, $uploadimg_dir.$result_name);
	imagedestroy($background_img);
}

$data = array();
$data['result'] = $result_name;
echo json_encode($data);

?>