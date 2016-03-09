<?php
session_start();
$params = array(
	"imgUrl" => $_POST["imgUrl"],
	"imgAbsWidth" => $_POST["imgAbsWidth"],
	"imgAbsHeight" => $_POST["imgAbsHeight"],
	"markUrl" => $_POST["markUrl"],
	"markAbsWidth" => $_POST["markAbsWidth"],
	"markAbsHeight" => $_POST["markAbsHeight"],
	"markTop" => $_POST["markTop"],
	"markLeft" => $_POST["markLeft"],
	"markOpacity" => $_POST["markOpacity"],
	"markMarginX" => $_POST["markMarginX"],
	"markMarginY" => $_POST["markMarginY"],
	"markWrapOffsetX" => $_POST["markWrapOffsetX"],
	"markWrapOffsetY" => $_POST["markWrapOffsetY"],
	"activeMode" => $_POST["activeMode"]
);

include('simpleimage.php');
$uploadimg_dir = "../uploadimg/";
$opacity = $params['markOpacity'];
$markLeft = $params['markLeft'];
$markTop = $params['markTop'];
$view = $params['activeMode'];
$markMarginX = $params['markMarginX'];
$markMarginY = $params['markMarginY'];

// Temporary files watermark
$mark_tmp_name = session_id().'-watermark-tmp.png';

// The resulting file
$result_name = session_id().'-result.png';

// Load watermark
$mark_tmp_obj = new SimpleImage('../'.$params['markUrl']);

// If watermark more background, resize watermark
if ($params['markAbsWidth'] > $params['imgAbsWidth'] || 
	$params['markAbsHeight'] > $params['imgAbsHeight'] ) {
	$mark_tmp_obj->resize($params['imgAbsWidth'], $params['imgAbsHeight']);
}
// Save watermark with transparency
$mark_tmp_obj->opacity($opacity);
$mark_tmp_obj->save($uploadimg_dir.$mark_tmp_name, 100, 'png');

$background_img = createImg('../'.$params['imgUrl']);
$watermark_img = createImg($uploadimg_dir.$mark_tmp_name);

$mark_w = $mark_tmp_obj->get_width(); // Width watermark after Resize
$mark_h = $mark_tmp_obj->get_height(); // Height watermark after Resize

// Display modes
if ($view == "one") {
	imagecopy($background_img, $watermark_img, $markLeft, $markTop, 0, 0, $mark_w, $mark_h);
}else{
	$left = $params["markWrapOffsetX"];
	$top = $params["markWrapOffsetY"];
	while($top <= $params['imgAbsHeight']) {
		while($left <= $params['imgAbsWidth']) {
			imagecopy($background_img, $watermark_img, $left, $top, 0, 0, $mark_w, $mark_h);
			$left = $left + $mark_w + $markMarginX;
		}

		$left = $params["markWrapOffsetX"];
		$top = $top + $mark_h + $markMarginY;
	}
}

// Upload the resulting file
imagepng($background_img, $uploadimg_dir.$result_name);
imagedestroy($background_img);


// Create an image identifier
function createImg ($image) {
  switch (exif_imagetype($image)) {
      case IMAGETYPE_GIF :
          $img = imagecreatefromgif($image);
           imagesavealpha($img, true);
          break;
      case IMAGETYPE_JPEG :
          $img = imagecreatefromjpeg($image);
           imagesavealpha($img, true);
          break;
      case IMAGETYPE_PNG :
          $img = imagecreatefrompng($image);
          imagesavealpha($img, true);
          break;
      default :
          throw new InvalidArgumentException('Invalid image type');
  }
  return $img;
}

// Return the name of the output file
$data = array();
$data['result'] = $result_name;
echo json_encode($data);
?>