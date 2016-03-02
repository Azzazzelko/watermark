(function($){
  var $form;

  init();
  attachEvents();

  function init() {
    $form = $('.form');
  }

  function attachEvents() {
    $form.on('submit', onDownload);
  }

  function onDownload (event){
    event.preventDefault();
    var formdata = $form.serialize(),
        urlHandlerAjax = $form.attr('action');

      ajaxOptions = {
        url: urlHandlerAjax,
        type: 'post',
        data: {formdata:formdata},
        dataType: 'json',
        success: ajaxSuccessForm
      };
      
      $.ajax(ajaxOptions);
  }

  function ajaxSuccessForm (data) {
    downloadResImg(data.result);
  }

  function downloadResImg(response) {
    var href = 'php/download-img.php?file='+response;
    window.downloadFile = function(url) {
      window.open(url, '_self');
    }
    window.downloadFile(href);
  };  

})(jQuery);