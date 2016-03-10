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
      vars.imgValid = bool;
    }
    if(imgtype == 'watermark') {
      vars.markValid = bool;
    }
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
          vars.imgUrl = imgUrl;
          vars.imgWrapAbsWidth = resultWidth;
          vars.imgWrapAbsHeight = resultHeight;
          vars.imgAbsWidth = resultWidth;
          vars.imgAbsHeight = resultHeight;

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

              vars.imgRelCoef = vars.imgRelHeight /  vars.imgAbsHeight;

        } else {
              vars.imgRelWidth = Math.round(vars.contHeight * vars.imgAbsWidth / vars.imgAbsHeight);
              vars.imgRelHeight = vars.contHeight;

              vars.imgWrapRelWidth = vars.imgRelWidth;
              vars.imgWrapRelHeight = vars.imgRelHeight;

              vars.imgRelCoef = vars.imgRelWidth /  vars.imgAbsWidth;
        }
      } else {
            vars.imgRelWidth = vars.imgAbsWidth;
            vars.imgRelHeight = vars.imgAbsHeight;

            vars.imgWrapRelWidth = vars.imgRelWidth;
            vars.imgWrapRelHeight = vars.imgRelHeight;

            vars.imgRelCoef = 1;

      }
      $img.removeAttr("src").attr('src', vars.imgUrl+'?'+Math.random()).attr('width', vars.imgRelWidth).attr('height', vars.imgRelHeight);
      $imgWrap.css({'width': vars.imgWrapRelWidth, 'height': vars.imgWrapRelHeight});

    } else {
      if ((vars.markAbsWidth*vars.imgRelCoef > Math.round(vars.imgWrapRelWidth)) || (vars.markAbsHeight*vars.imgRelCoef > Math.round(vars.imgWrapRelHeight))) {

        if (vars.markAbsWidth / vars.imgWrapRelWidth >= vars.markAbsHeight / vars.imgWrapRelHeight) {
              vars.markRelWidth = vars.imgWrapRelWidth;
              vars.markRelHeight = Math.round(vars.imgWrapRelWidth * vars.markAbsHeight / vars.markAbsWidth);

        } else {
              vars.markRelHeight = vars.imgWrapRelHeight;
              vars.markRelWidth = Math.round(vars.imgWrapRelHeight * vars.markAbsWidth / vars.markAbsHeight);

        }
      } else {
            vars.markRelWidth = vars.markAbsWidth * vars.imgRelCoef;
            vars.markRelHeight = vars.markAbsHeight * vars.imgRelCoef;
      }
      $mark.css({'width': vars.markRelWidth, 'height': vars.markRelHeight, 'top': vars.markTop, 'left': vars.markLeft});
      $mark.attr('src', vars.markUrl);
      vars.markTopLimit=(vars.imgRelHeight-vars.markRelHeight);
      vars.markLeftLimit=(vars.imgRelWidth-vars.markRelWidth);
      setLimits();
      setDefaultPosition(); // установка 9-ти стандартных позиций
      resetAllSettings(); // чтоб новая картинка становилась в стандартную позицию
      createMarkOneBg();
      $mark.removeAttr("src").attr('src', vars.markUrl+'?'+Math.random());
    }
  }
});
