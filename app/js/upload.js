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
        resultHeight = result.data_height,

        $cont = $('.container-img'),
        contWidth = $cont.data('width'),
        contHeight = $cont.data('height'),

        $imgWrap = $('.img-wrap'),
        imgWrapAbsWidth = $imgWrap.attr('data-abs-width'),
        imgWrapAbsHeight = $imgWrap.attr('data-abs-height'),
        imgWrapRelWidth = $imgWrap.attr('data-rel-width'),
        imgWrapRelHeight = $imgWrap.attr('data-rel-height'),
        imgWrapTop = $imgWrap.attr('data-top'),
        imgWrapLeft = $imgWrap.attr('data-left'),

        $img = $('.item-img'),
        imgAbsWidth = $img.attr('data-abs-width'),
        imgAbsHeight = $img.attr('data-abs-height'),
        imgRelWidth = $img.attr('data-rel-width'),
        imgRelHeight = $img.attr('data-rel-height'),


        $mark = $('.watermark-img'),
        markAbsWidth = $mark.attr('data-abs-width'),
        markAbsHeight = $mark.attr('data-abs-height'),
        markRelWidth = $mark.attr('data-rel-width'),
        markRelHeight = $mark.attr('data-rel--height'),
        markTop = $mark.attr('data-top'),
        markLeft = $mark.attr('data-left');




    if (imgType == 'background') {
      $imgWrap.attr('src', imgUrl)
          .attr('data-abs-width', resultWidth)
          .attr('data-abs-height', resultHeight);
      $img.attr('src', imgUrl)
          .attr('data-abs-width', resultWidth)
          .attr('data-abs-height', resultHeight);
      imgWrapAbsWidth = resultWidth;
      imgWrapAbsHeight = resultHeight;
      imgAbsWidth = resultWidth;
      imgAbsHeight = resultHeight;
      $mark
          .attr('data-abs-width', 0)
          .attr('data-abs-height', 0)
          .attr('data-rel-width', 0)
          .attr('data-rel-height', 0)
          .css({'width': 0, 'height': 0, 'top': 0, 'left': 0});
      markAbsWidth = 0;
      markAbsHeight = 0;

    } else {
      $mark.attr('src', imgUrl)
          .attr('data-abs-width', resultWidth)
          .attr('data-abs-height', resultHeight);
      markAbsWidth = resultWidth;
      markAbsHeight = resultHeight;
    }



    if (imgType == 'background') {
      if ((imgAbsWidth > contWidth) || (imgAbsHeight >contHeight)) {


        if (imgAbsWidth / contWidth >= imgAbsHeight / contHeight) {
          var
              imgRelWidth = contWidth,
              imgRelHeight = Math.round(contWidth * imgAbsHeight / imgAbsWidth);

              imgWrapRelWidth = imgRelWidth,
              imgWrapRelHeight = imgRelHeight;

          imgWrapLeft = 0;
          imgWrapTop = Math.round((contHeight - imgWrapRelHeight) / 2);

        } else {
          var
              imgRelWidth = Math.round(contHeight * imgAbsWidth / imgAbsHeight),
              imgRelHeight = contHeight;

              imgWrapRelWidth = imgRelWidth,
              imgWrapRelHeight = imgRelHeight;

          imgWrapLeft = Math.round((contWidth - imgWrapRelWidth) / 2);
          imgWrapTop = 0;

        }
      } else {
        var
            imgRelWidth = imgAbsWidth,
            imgRelHeight = imgAbsHeight;

            imgWrapRelWidth = imgRelWidth,
            imgWrapRelHeight = imgRelHeight;

            imgWrapLeft = Math.round((contWidth - imgWrapRelWidth) / 2);
            imgWrapTop = Math.round((contHeight - imgWrapRelHeight) / 2);
      }
      $img.attr('width', imgRelWidth).attr('height', imgRelHeight);
      $imgWrap.css({'width': imgWrapRelWidth, 'height': imgWrapRelHeight, 'top': imgWrapTop, 'left': imgWrapLeft});
      $imgWrap.attr('src', imgUrl)
          .attr('data-rel-width', imgWrapRelWidth)
          .attr('data-rel-height', imgWrapRelHeight);
      $img.attr('src', imgUrl)
          .attr('data-rel-width', imgWrapRelWidth)
          .attr('data-rel-height', imgWrapRelHeight);
    } else {

      //console.log(markAbsWidth);
      //console.log(imgWrapRelWidth);
      //console.log(markAbsHeight);
      //console.log(imgWrapRelHeight);

      if ((markAbsWidth > Math.round(imgWrapRelWidth)) || (markAbsHeight > Math.round(imgWrapRelHeight))) {

        if (markAbsWidth / imgWrapRelWidth >= markAbsHeight / imgWrapRelHeight) {
          var
              markRelWidth = imgWrapRelWidth,
              markRelHeight = Math.round(imgWrapRelWidth * markAbsHeight / markAbsWidth)
              ;

          //markLeft = 0;
          //markTop = (wrapRelHeight - markRelHeight) / 2;

        } else {
          var
              markRelHeight = imgWrapRelHeight,
              markRelWidth = Math.round(imgWrapRelHeight * markAbsWidth / markAbsHeight)
          ;

          //markLeft = (wrapRelWidth - markRelWidth) / 2;
          //markTop = 0;

        }

      } else {

        var
            markRelWidth = markAbsWidth,
            markRelHeight = markAbsHeight;


      }
      $mark//.attr('width', markRelWidth).attr('height', markRelHeight)
      .css({'width': markRelWidth, 'height': markRelHeight, 'top': markTop, 'left': markLeft});
      $mark.attr('src', imgUrl)
          .attr('data-rel-width', markRelWidth)
          .attr('data-rel-height', markRelHeight);
    }
  };


  return {
    init:function(result, imgType) {
        _getSizes(result, imgType);
        
    }
  }
}());