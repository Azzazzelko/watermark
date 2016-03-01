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
                }
            })
            .error(function (jqXHR, textStatus, errorThrown) {
              //addToolTip($this,'Ошибка загрузки файла');
              console.log('Ошибка загрузки файла');
            });
          },

        progress: function(e, data){
            controlForm.addToolTip($(this),'Загрузка файла, подождите....');
          }
        })
      }
    }


})();

  /**
   *
   * Работа с формой
   *
   */
(function() {
  var my,
      $currentForm;

  publicInterface();

  /**
   * Отображение ToolTip
   */
  function addToolTipError ($element, toltiptext) {
    var $tooltip = $element.closest('.form__item').find('.tooltipstext');
        $tooltip.text(toltiptext);

      $tooltip.fadeIn(100, function(){

      if ($element.attr('type') !== 'file') {
        $element.addClass('error');
      }else {
        $('.label_upload_file').addClass('error');
      }
     });
  }

  /**
   * Скрытие ToolTip
   */
  function delToolTipError ($element) {
    var $tooltip = $element.closest('.form__item').find('.tooltipstext');

    $tooltip.fadeOut(100, function(){
      $element.removeClass('error');
      if ($element.attr('type') !== 'file') {
          $element.removeClass('error');
      }else {
        $('.label_upload_file').removeClass('error');
      }
    });
  }

  /**
   * Вывод сообщения перед отправкой данных на сервер
   */
  function ajaxBeforeSendForm() {
    var jsondata = {'status':'server_before', 'status_text':'Подождите ответ от сервера.'};
    createStatusServer ($currentForm, jsondata);
  }

  /**
   * Вывод сообщения при упешной отправке данных на сервер
   */
  function ajaxSuccessForm(jsondata) {
    var idform = $currentForm.attr('id'),
        status = jsondata['status'];

    createStatusServer ($currentForm, jsondata);

    if (idform === 'login_form' && status === 'server_ok') {
       setTimeout("document.location.href='../loft1php'", 1000);
    }

    if (idform === 'popup_form' && status === 'server_ok') {
      $('.myinfo-container').prepend(jsondata['project_new']);
        setTimeout( function (){
          $(".popup__overlay").trigger( "click" );
        }, 2000);
    }
  }

  /**
   * Вывод сообщения об ошибке на сервере
   */
  function ajaxErrorForm(error) {
    var jsondata = {'status':'server_error', 'status_text':'Ошибка сервера ajax'};
    createStatusServer ($currentForm, jsondata);
  }

  /**
   * Отображение сообщений сервера пользователю
   */
  function createStatusServer ($form, jsondata) {
    var status = jsondata['status'],
      status_text = jsondata['status_text'],
      $sever_mess = $form.find('.sever_mess');

    if (status === 'server_before') {
      $sever_mess.removeClass('server_error server_ok')
                 .addClass('server_before')
                 .find('.server_mess_title')
                 .text('Одну минуточку...');
    }

    if (status === 'server_error' ) {
      $sever_mess.removeClass('server_ok')
                 .addClass('server_error')
                 .find('.server_mess_title')
                 .text('Ошибка!');
    }

    if (status === 'server_ok') {
      $sever_mess.removeClass('server_error')
                 .addClass('server_ok')
                 .find('.server_mess_title')
                 .text('Спасибо!');
    }

    $sever_mess.find('.server_mess_desc').text(status_text);
  }


   /**
   * Открытые методы
   */
  function publicInterface() {
    my = {

      /**
       * Проверка заполнения форм пользователем
       */
      validForm: function($form) {
              var isValidForm = true,
                  toltipText;

              $form.find('input, textarea').each(function(e) {
                var $this = $(this),
                    labeltext='';

                if ($this.val() === '') {

                  labeltext = $this.closest('.form__item').find('.label_text').text();
                  toltipText = 'Заполните поле "' + labeltext + '"';

                  isValidForm = false;
                  addToolTipError($this, toltipText);
                }
              });

              return isValidForm;
            },

      /**
       * Скрытие ToolTip у элемента
       */
      delToolTip: function ($element) {
        delToolTipError($element);
      },

      /**
       * Добавление ToolTip элементу
       */
      addToolTip: function ($element, toltiptext){
        addToolTipError($element, toltiptext);
      },

      /**
       * Очистка полей формы
       */
      clearForm: function ($form) {
        $form.find("input, textarea").each(function(e) {
          var $this = $(this);

            $this.val('');
            $('.upload_paht_file').text('Загрузите изображение');
            delToolTipError($this);
        });

        $form.find('.sever_mess').removeClass('server_error server_ok server_before');
      },

      /**
       * Отправка данных на сервер
       */
      sendAjax: function($form){
          var formdata = $form.serialize(),
            urlHandlerAjax = $form.attr('action');

            ajaxOptions = {
              url: urlHandlerAjax,
              type: 'post',
              data: {formdata : formdata},
              dataType: 'json',
              beforeSend: ajaxBeforeSendForm,
              success: ajaxSuccessForm,
              error: ajaxErrorForm
            };

        $currentForm = $form;
        $.ajax(ajaxOptions);
      }
    };
  }

  window.controlForm = my;
})();
