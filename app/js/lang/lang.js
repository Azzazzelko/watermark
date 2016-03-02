var lang = (function(){
	var init = function(){
		setUpListeners();
	};

	var setUpListeners = function(){
		$(".languages-ru").on("click", function(){
			getJson('js/lang/langRu.json');
		});

		$(".languages-eng").on("click", function(){
			getJson('js/lang/langEng.json');
		});
	}

	function getJson(path){
		$.getJSON(path, function(data){
			changeLang(data);
		});
	};

	function changeLang(data){
	  var currentLang = data,
	      langItems = $("[data-lang]");

	  langItems.each(function(){
	    var $this = $(this);
	    
	    $.each(currentLang, function(key, value){   
	      if ( $this.attr("data-lang") == key ){
	        $this.html(value);
	      }

	      if ( $this.attr("data-lang") == key && $this.hasClass('reset') ){
	      	$this.val(value);
	      }
	    });
	  });
	};

	return {
		init:init
	}	

}());

$(document).ready(function(){
	lang.init();
});
