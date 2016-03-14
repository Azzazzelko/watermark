<?php
session_start();
if(isset($_FILES['files']) && $_FILES['files']['error'] == 0){

	$project_file = $_FILES['files'];
	$project_dir = "uploadimg";
	// Создадим директорию на сервере, если её нет.
	if (!file_exists('../'.$project_dir)) {
		mkdir('../'.$project_dir, 0777);
	}

	// Закачиваем файл
	if(is_uploaded_file($project_file["tmp_name"])) {

		// Проверка формата файла
		$extension = strtolower(pathinfo($project_file['name'], PATHINFO_EXTENSION));
		$allowed = array('png', 'jpeg', 'jpg', 'gif');
		if(!in_array(strtolower($extension), $allowed)){
			echo '{"status":"server_error", "text_status":"uferror4"}';
			return;
		}

		// Проверка размера файла
		if ($project_file["size"] > 1024*1024*5 ) {
			echo '{"status":"server_error", "text_status":"uferror3"}';
			return;
		}

		// Новое имя файла
		$new_file_name = session_id().'-'.$_COOKIE['imgtype'].'.'.$extension;

		// Полный путь куда копировать
		$final_path = "../".$project_dir."/".$new_file_name;

		// Перемещаем файл в нужную нам папку.
		if(move_uploaded_file($project_file["tmp_name"], $final_path)) {
			list($width, $height, $type, $attr) = getimagesize($final_path);
			echo '{"status":"server_ok",
				   "text_status":"'.$new_file_name.'",
				   "data_width":"'.$width.'",
				   "data_height":"'.$height.'"
				}';
			return;
		} else {
			echo '{"status":"server_error", "text_status":"uferror2"}';
			return;
		}

	} else {
		echo '{"status":"server_error", "text_status":"uferror2"}';
		return;
	}
}
echo '{"status":"server_error", "text_status":"uferror1"}';
return;
