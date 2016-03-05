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
	"markLeft" => $_POST["markLeft"],
	"markOpacity" => $_POST["markOpacity"]
);

// для проверки выводится весь массив в js
//echo json_encode($params);

if (isset($_POST['formdata'])) {

	parse_str($_POST['formdata'], $params);

	$background = strip_tags(htmlspecialchars(trim($params['background'])));
	$watermark = strip_tags(htmlspecialchars(trim($params['watermark'])));
	$view = strip_tags(htmlspecialchars(trim($params['view'])));
	$x_margin = strip_tags(htmlspecialchars(trim($params['x-margin'])));
	$y_margin = strip_tags(htmlspecialchars(trim($params['y-margin'])));

	$x = strip_tags(htmlspecialchars(trim($params['x-coordinates'])));
	$y = strip_tags(htmlspecialchars(trim($params['y-coordinates'])));

	$opacity = strip_tags(htmlspecialchars(trim($params['opacity'])));
	$opacity = $opacity*100;
} else {
	echo '{"status":"error", "status_text":"Не хватает данных"}';
	return;
}

	if ($opacity ==0) {
		$opacity = 100;
	}

	$img_path = "../uploadimg/";
	$download_file = session_id()."-result.png";
	$download_file_path = $img_path.$download_file;
	$background_file = $img_path.$background;
	$watermark_file = $img_path.$watermark;


	$background_img = createImg($background_file);
	$watermark_img = createImg($watermark_file);


	// Установка полей для штампа и получение высоты/ширины штампа
	$x_margin = 100;
	$y_margin = 100;
	$sx = imagesx($watermark_img); // Ширина водяного знака
	$sy = imagesy($watermark_img); // Высота водяного знака

	// Копирование изображения водяного знака на фотографию с помощью смещения края
	if ($view == "one") {
		imagecopymerge($background_img, $watermark_img , $x, $y, 0, 0, $sx , $sy, $opacity);
	}


	// Вывод и освобождение памяти
	header('Content-type: image/png');
	imagepng($background_img, $download_file_path, 0, 0);
	//imagejpeg($background_img, $download_file_path, 0, 0);
	imagedestroy($background_img);

	$data = array();
	$data['result'] = $download_file;
	echo json_encode($data);


	// Создание идентификатора изображения, полученного из данного файла.
	function createImg ($image) {
	  switch (exif_imagetype($image)) {
	      case IMAGETYPE_GIF :
	          $img = imagecreatefromgif($image);
	          break;
	      case IMAGETYPE_JPEG :
	          $img = imagecreatefromjpeg($image);
	          break;
	      case IMAGETYPE_PNG :
	          $img = imagecreatefrompng($image);
	          break;
	      default :
	          throw new InvalidArgumentException('Invalid image type');
	  }
	  return $img;
	}
?>