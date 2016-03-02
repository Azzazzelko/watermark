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
                  var imgWidth = 1800;
                  var imgHeight = 841;
                  var imgWidth = result.width;
                  var imgHeight = result.height;

                  var imgUrl = 'uploadimg/' + result.text_status;

                  if (imgtype == 'background') {

                    $('.item-img').attr('src', imgUrl)
                                .attr('data-width', imgWidth)
                                .attr('data-height', imgHeight);

                    if (imgWidth/605 > imgHeight/304) {
                        newHeight = 651 * imgHeight / imgWidth;
                        $('.item-img').attr('width', 651).attr('height', newHeight);
                    } else {
                        newWidth = 304 * imgWidth / imgHeight;
                        $('.item-img').attr('width', newWidth).attr('height', 304);
                    }
                  }

                  if (imgtype == 'watermark') {
                    $('.watermark-img').attr('src', imgUrl)
                                      .attr('data-width', imgWidth)
                                      .attr('data-height', imgHeight);

                    if (imgWidth/605 > imgHeight/534) {
                      newHeight = 651/3 * imgHeight / imgWidth;
                      $('.watermark-img').attr('width',651/3).attr('height', newHeight);
                    } else {
                      newWidth = 534/3 * imgWidth / imgHeight;
                      $('.watermark-img').attr('width', newWidth).attr('height', 534/3);
                    }
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
