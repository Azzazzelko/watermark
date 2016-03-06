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
                  //$("input[type='hidden'][name="+imgtype+"]").val(result.text_status);

                  ImageSetting.init(result, imgtype);


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

var ImageSetting = (function() {
  var _getSizes = function(result, imgType) {

    var
        imgName = result.text_status,
        imgUrl = 'uploadimg/' + imgName,
        resultWidth = result.data_width,
        resultHeight = result.data_height;




    if (imgType == 'background') {
      vars.imgUrl = imgUrl;
      vars.imgWrapAbsWidth = resultWidth;
      vars.imgWrapAbsHeight = resultHeight;
      vars.imgAbsWidth = resultWidth;
      vars.imgAbsHeight = resultHeight;
      $mark.css({'width': 0, 'height': 0, 'top': 0, 'left': 0});
      vars.markAbsWidth = 0;
      vars.markAbsHeight = 0;
    } else {
      vars.markUrl = imgUrl;
      vars.markAbsWidth = resultWidth;
      vars.markAbsHeight = resultHeight;
    }



    if (imgType == 'background') {
      if ((vars.imgAbsWidth > vars.contWidth) || (vars.imgAbsHeight >vars.contHeight)) {


        if (vars.imgAbsWidth / vars.contWidth >= vars.imgAbsHeight / vars.contHeight) {

              vars.imgRelWidth = vars.contWidth;
              vars.imgRelHeight = Math.round(vars.contWidth * vars.imgAbsHeight / vars.imgAbsWidth);

              vars.imgWrapRelWidth = vars.imgRelWidth;
              vars.imgWrapRelHeight = vars.imgRelHeight;

          vars.imgWrapLeft = 0;
          vars.imgWrapTop = Math.round((vars.contHeight - vars.imgWrapRelHeight) / 2);

        } else {
              vars.imgRelWidth = Math.round(vars.contHeight * vars.imgAbsWidth / vars.imgAbsHeight);
              vars.imgRelHeight = vars.contHeight;

              vars.imgWrapRelWidth = vars.imgRelWidth;
              vars.imgWrapRelHeight = vars.imgRelHeight;

          vars.imgWrapLeft = Math.round((vars.contWidth - vars.imgWrapRelWidth) / 2);
          vars.imgWrapTop = 0;
        }
      } else {
            vars.imgRelWidth = vars.imgAbsWidth;
            vars.imgRelHeight = vars.imgAbsHeight;

            vars.imgWrapRelWidth = vars.imgRelWidth;
            vars.imgWrapRelHeight = vars.imgRelHeight;

            vars.imgWrapLeft = Math.round((vars.contWidth - vars.imgWrapRelWidth) / 2);
            vars.imgWrapTop = Math.round((vars.contHeight - vars.imgWrapRelHeight) / 2);
      }
      $img.attr('src', vars.imgUrl).attr('width', vars.imgRelWidth).attr('height', vars.imgRelHeight);
      $imgWrap.css({'width': vars.imgWrapRelWidth, 'height': vars.imgWrapRelHeight, 'top': vars.imgWrapTop, 'left': vars.imgWrapLeft});


    } else {
      if ((vars.markAbsWidth > Math.round(vars.imgWrapRelWidth)) || (vars.markAbsHeight > Math.round(vars.imgWrapRelHeight))) {

        if (vars.markAbsWidth / vars.imgWrapRelWidth >= vars.markAbsHeight / vars.imgWrapRelHeight) {
              vars.markRelWidth = vars.imgWrapRelWidth;
              vars.markRelHeight = Math.round(vars.imgWrapRelWidth * vars.markAbsHeight / vars.markAbsWidth);

        } else {
              vars.markRelHeight = vars.imgWrapRelHeight;
              vars.markRelWidth = Math.round(vars.imgWrapRelHeight * vars.markAbsWidth / vars.markAbsHeight);

        }
      } else {
            vars.markRelWidth = vars.markAbsWidth;
            vars.markRelHeight = vars.markAbsHeight;
      }
      $mark.css({'width': vars.markRelWidth, 'height': vars.markRelHeight, 'top': vars.markTop, 'left': vars.markLeft});
      $mark.attr('src', vars.markUrl);
    }
  };


  return {
    init:function(result, imgType) {
        _getSizes(result, imgType);

    }
  }
}());