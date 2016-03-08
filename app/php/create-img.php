<?php
session_start();
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
	"markLeft" => $_POST["markLeft"],
	"markOpacity" => $_POST["markOpacity"],
	"markMarginX" => $_POST["markMarginX"],
	"markMarginY" => $_POST["markMarginY"],
	"activeMode" => $_POST["activeMode"]
);

include('ac_image_class.php');
$uploadimg_dir = "../uploadimg/";
$opacity = $params['markOpacity']*100;
$markLeft = $params['markLeft'];
$markTop = $params['markTop'];
$view = $params['activeMode'];
$markMarginX = $params['markMarginX'];
$markMarginY = $params['markMarginY'];

// Temporary files
$img_tmp_name = session_id().'-background-tmp';
$mark_tmp_name = session_id().'-watermark-tmp';

// The resulting file
$result_name = session_id().'-result.png';

$img_tmp_obj = new acResizeImage('../'.$params['imgUrl']);
$img_tmp_obj ->save($uploadimg_dir, $img_tmp_name, 'png', true);

// If watermark more background, resize watermark
$mark_tmp_obj = new acResizeImage('../'.$params['markUrl']);
if ($params['markAbsWidth'] > $params['imgAbsWidth'] || 
	$params['markAbsHeight'] > $params['imgAbsHeight'] ) {
	$mark_tmp_obj->resize($params['imgAbsWidth'], $params['imgAbsHeight']);
}
$mark_tmp_obj ->save($uploadimg_dir, $mark_tmp_name, 'png', true);

$background_img = imagecreatefrompng($uploadimg_dir.$img_tmp_name.'.png');
$watermark_img = imagecreatefrompng($uploadimg_dir.$mark_tmp_name.'.png');

$mark_w = imagesx($watermark_img); // Width watermark after Resize
$mark_h = imagesy($watermark_img); // Height watermark after Resize

// Display modes
if ($view == "one") {
	imagecopymerge($background_img, $watermark_img, $markLeft, $markTop, 0, 0, $mark_w, $mark_h, $opacity);
}else{
	$left = $markLeft;
	$top = $markTop;
	while($top <= $params['imgAbsHeight']) {
		while($left <= $params['imgAbsWidth']) {
			imagecopymerge($background_img, $watermark_img, $left, $top, 0, 0, $mark_w, $mark_h, $opacity);
			$left = $left + $mark_w + $markMarginX;
		}

		$left = $markLeft;
		$top = $top + $mark_h + $markMarginY;
	}
}

// Upload the resulting file
imagepng($background_img, $uploadimg_dir.$result_name);
imagedestroy($background_img);

// Return the name of the output file
$data = array();
$data['result'] = $result_name;
echo json_encode($data);
?>