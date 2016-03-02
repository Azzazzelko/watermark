(function(){

  init();
  attachEvents();

  /**
   * Инициализация
   */
  function init() {
    initFileUpload('background');
    initFileUpload('watermark');
  }

  /**
   * Инициализация закгрузчиков файлов
   */
  function attachEvents() {
    $('.upload').on('change', onChangeFile);
  }

  /**
   * Выбор загружаемого файла
   */
  function onChangeFile (element) {
    var $this = $(this),
        paht_file = $this.val().replace(/.+[\\\/]/, "");
    if (paht_file) {
      $this.closest('.fileform').find('.fileformlabel').text(paht_file);
    }else {
      $this.closest('.fileform').find('.fileformlabel').text('Изображение');
    }
  }

  /**
   * Загрузчик файлов
   */
  function initFileUpload (imgtype) {
    if($('input[type=file]').length>0) {
      $('#'+imgtype).fileupload({
        url: 'php/upload.php?www=ttt',
        dataType: 'json',
        replaceFileInput: false,
        maxNumberOfFiles: 1,

        add: function(e, data) {
          var jsondata,
              $this = $(this);
              $.cookie("imgtype", imgtype);

              data.submit()
              .success(function (result, textStatus, jqXHR) {
                if (result.status === 'server_error') {

                  //addToolTip($this, result.text_status);
                  console.log(result.text_status);


                } else {
                  //delToolTip($this);
                  $("input[type='hidden'][name="+imgtype+"]").val(result.text_status);

                  if (imgtype == 'background') {
                    $('.item-img').attr('src', 'uploadimgs/' + result.text_status)
                                  .data('width', 'uploadimgs/' + result.img_width)
                                  .data('height', 'uploadimgs/' + result.img_height);
                  }
                  if (imgtype == 'watermark') {
                    $('.watermark-img').attr('src', 'uploadimg/' + result.text_status)
                                        .data('width', 'uploadimgs/' + result.img_width)
                                        .data('height', 'uploadimgs/' + result.img_height);
                  }
                }
            })
            .error(function (jqXHR, textStatus, errorThrown) {
              //addToolTip($this,'Ошибка загрузки файла');
              console.log('Ошибка загрузки файла');
            });
          },

        progress: function(e, data){
            //addToolTip($(this),'Загрузка файла, подождите....');
            console.log('Загрузка файла, подождите....');
          }
        })
      }
    }
})();
