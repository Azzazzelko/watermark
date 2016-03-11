$(document).ready(function() {

  init();
  attachEvents();

  /**
   * Инициализация закгрузчиков файлов
   */
  function init() {
    initFileUpload('background');
    initFileUpload('watermark');
  }

  function attachEvents() {
    $('.upload').on('change', onChangeFile);
  }

  function showToolTip($element, toltiptext) {
    var jsondata = $('.language_active').attr('data-lang-url');

    hideToolTip($element);

    $.getJSON(jsondata, function(data){
      $element
        .closest('.fileform')
        .find('.tooltipstext')
        .text(data[toltiptext])
        .css({"display":"block"});
    });
  }

  function hideToolTip($element) {
    $element
      .closest('.fileform')
      .find('.tooltipstext')
      .css({"display":"none"});
  }

  function setImgValidation (imgtype, bool) {
    if(imgtype == 'background') {
      WaterMarkModule.variables.vars.imgValid = bool;
    }
    if(imgtype == 'watermark') {
      WaterMarkModule.variables.vars.markValid = bool;
    }
    WaterMarkModule.emptyFileField();
  }
  /**
   * Выбор загружаемого файла
   */
  function onChangeFile (element) {
    var $this = $(this),
        paht_file = $this.val().replace(/.+[\\\/]/, "");
    if (paht_file) {
      $this
        .closest('.fileform')
        .find('.fileformlabel')
        .text(paht_file)
        .attr("data-change", "true");
    }else {
      $this
        .closest('.fileform')
        .find('.fileformlabel')
        .text('Изображение')
        .attr("data-change", "false");
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
              showToolTip($this, 'uferror5');

              data.submit()
              .success(function (result, textStatus, jqXHR) {
                if (result.status === 'server_error') {
                  showToolTip($this, result.text_status);
                  setImgValidation(imgtype, false);
                } else {
                  hideToolTip($this);
                  setImgValidation(imgtype, true);
                  getSizes(result, imgtype);
                }
              })
              .error(function (jqXHR, textStatus, errorThrown) {
                showToolTip($this, result.text_status);
                setImgValidation(imgtype, false);
              });
            }
        })
      }
    }

    function getSizes(result, imgType) {
      var
        imgName = result.text_status,
        imgUrl = 'uploadimg/' + imgName,
        resultWidth = result.data_width,
        resultHeight = result.data_height;

        $('.markClone').remove();

        if (imgType == 'background') {
          WaterMarkModule.variables.vars.imgUrl = imgUrl;
          WaterMarkModule.variables.vars.imgWrapAbsWidth = resultWidth;
          WaterMarkModule.variables.vars.imgWrapAbsHeight = resultHeight;
          WaterMarkModule.variables.vars.imgAbsWidth = resultWidth;
          WaterMarkModule.variables.vars.imgAbsHeight = resultHeight;

          WaterMarkModule.variables.vars.markAbsWidth = 0;
          WaterMarkModule.variables.vars.markAbsHeight = 0;
        } else {
          WaterMarkModule.variables.vars.markUrl = imgUrl;
          WaterMarkModule.variables.vars.markAbsWidth = resultWidth;
          WaterMarkModule.variables.vars.markAbsHeight = resultHeight;
        }

    if (imgType == 'background') {
      if ((WaterMarkModule.variables.vars.imgAbsWidth > WaterMarkModule.variables.vars.contWidth) || (WaterMarkModule.variables.vars.imgAbsHeight >WaterMarkModule.variables.vars.contHeight)) {

        if (WaterMarkModule.variables.vars.imgAbsWidth / WaterMarkModule.variables.vars.contWidth >= WaterMarkModule.variables.vars.imgAbsHeight / WaterMarkModule.variables.vars.contHeight) {

              WaterMarkModule.variables.vars.imgRelWidth = WaterMarkModule.variables.vars.contWidth;
              WaterMarkModule.variables.vars.imgRelHeight = Math.round(WaterMarkModule.variables.vars.contWidth * WaterMarkModule.variables.vars.imgAbsHeight / WaterMarkModule.variables.vars.imgAbsWidth);

              WaterMarkModule.variables.vars.imgWrapRelWidth = WaterMarkModule.variables.vars.imgRelWidth;
              WaterMarkModule.variables.vars.imgWrapRelHeight = WaterMarkModule.variables.vars.imgRelHeight;

              WaterMarkModule.variables.vars.imgRelCoef = WaterMarkModule.variables.vars.imgRelHeight /  WaterMarkModule.variables.vars.imgAbsHeight;

        } else {
              WaterMarkModule.variables.vars.imgRelWidth = Math.round(WaterMarkModule.variables.vars.contHeight * WaterMarkModule.variables.vars.imgAbsWidth / WaterMarkModule.variables.vars.imgAbsHeight);
              WaterMarkModule.variables.vars.imgRelHeight = WaterMarkModule.variables.vars.contHeight;

              WaterMarkModule.variables.vars.imgWrapRelWidth = WaterMarkModule.variables.vars.imgRelWidth;
              WaterMarkModule.variables.vars.imgWrapRelHeight = WaterMarkModule.variables.vars.imgRelHeight;

              WaterMarkModule.variables.vars.imgRelCoef = WaterMarkModule.variables.vars.imgRelWidth /  WaterMarkModule.variables.vars.imgAbsWidth;
        }
      } else {
            WaterMarkModule.variables.vars.imgRelWidth = WaterMarkModule.variables.vars.imgAbsWidth;
            WaterMarkModule.variables.vars.imgRelHeight = WaterMarkModule.variables.vars.imgAbsHeight;

            WaterMarkModule.variables.vars.imgWrapRelWidth = WaterMarkModule.variables.vars.imgRelWidth;
            WaterMarkModule.variables.vars.imgWrapRelHeight = WaterMarkModule.variables.vars.imgRelHeight;

            WaterMarkModule.variables.vars.imgRelCoef = 1;

      }
      WaterMarkModule.variables.img.removeAttr("src").attr('src', WaterMarkModule.variables.vars.imgUrl+'?'+Math.random()).attr('width', WaterMarkModule.variables.vars.imgRelWidth).attr('height', WaterMarkModule.variables.vars.imgRelHeight);
      WaterMarkModule.variables.imgWrap.css({'width': WaterMarkModule.variables.vars.imgWrapRelWidth, 'height': WaterMarkModule.variables.vars.imgWrapRelHeight});
           
    } else {
      if ((WaterMarkModule.variables.vars.markAbsWidth*WaterMarkModule.variables.vars.imgRelCoef > Math.round(WaterMarkModule.variables.vars.imgWrapRelWidth)) || (WaterMarkModule.variables.vars.markAbsHeight*WaterMarkModule.variables.vars.imgRelCoef > Math.round(WaterMarkModule.variables.vars.imgWrapRelHeight))) {

        if (WaterMarkModule.variables.vars.markAbsWidth / WaterMarkModule.variables.vars.imgWrapRelWidth >= WaterMarkModule.variables.vars.markAbsHeight / WaterMarkModule.variables.vars.imgWrapRelHeight) {
              WaterMarkModule.variables.vars.markRelWidth = WaterMarkModule.variables.vars.imgWrapRelWidth;
              WaterMarkModule.variables.vars.markRelHeight = Math.round(WaterMarkModule.variables.vars.imgWrapRelWidth * WaterMarkModule.variables.vars.markAbsHeight / WaterMarkModule.variables.vars.markAbsWidth);

        } else {
              WaterMarkModule.variables.vars.markRelHeight = WaterMarkModule.variables.vars.imgWrapRelHeight;
              WaterMarkModule.variables.vars.markRelWidth = Math.round(WaterMarkModule.variables.vars.imgWrapRelHeight * WaterMarkModule.variables.vars.markAbsWidth / WaterMarkModule.variables.vars.markAbsHeight);

        }
      } else {
            WaterMarkModule.variables.vars.markRelWidth = WaterMarkModule.variables.vars.markAbsWidth * WaterMarkModule.variables.vars.imgRelCoef;
            WaterMarkModule.variables.vars.markRelHeight = WaterMarkModule.variables.vars.markAbsHeight * WaterMarkModule.variables.vars.imgRelCoef;
      }
      WaterMarkModule.variables.mark.css({'width': WaterMarkModule.variables.vars.markRelWidth, 'height': WaterMarkModule.variables.vars.markRelHeight, 'top': WaterMarkModule.variables.vars.markTop, 'left': WaterMarkModule.variables.vars.markLeft});
      WaterMarkModule.variables.mark.attr('src', WaterMarkModule.variables.vars.markUrl);
      WaterMarkModule.variables.vars.markTopLimit=(WaterMarkModule.variables.vars.imgRelHeight-WaterMarkModule.variables.vars.markRelHeight);
      WaterMarkModule.variables.vars.markLeftLimit=(WaterMarkModule.variables.vars.imgRelWidth-WaterMarkModule.variables.vars.markRelWidth);
      WaterMarkModule.setLimits();
      WaterMarkModule.setDefaultPosition(); // установка 9-ти стандартных позиций
      WaterMarkModule.resetAllSettings(); // чтоб новая картинка становилась в стандартную позицию
      WaterMarkModule.createMarkOneBg();
      WaterMarkModule.variables.mark.removeAttr("src").attr('src', WaterMarkModule.variables.vars.markUrl+'?'+Math.random());
    }
  }
});
