var lang = (function(){		//== Languages change module
	var setUpListeners = function(){
		$(".languages-ru").on("click", function(){	//Clicking on the button RU
			getJson('js/lang/langRu.json');
		});

		$(".languages-eng").on("click", function(){ //Clicking on the button ENG
			getJson('js/lang/langEng.json');
		});
	}

	function getJson(path){		//== Function receiving JSON file
		$.getJSON(path, function(data){
			changeLang(data);
		});
	};

	function changeLang(data){	//== Function replacement text into the appropriate language
	  var currentLang = data,	//Selected language = selected json 
	      langItems = $("[data-lang]"); //All items containing the attribute "data-lang"

	  langItems.each(function(){ //Loop through each of them ..
	    var $this = $(this);
	    
	    $.each(currentLang, function(key, value){  //Loop through our JSON object
	      if ( $this.attr("data-lang") == key ){ //If the attribute of our element coincides with the key in the object, change its contents to value
	        $this.html(value);
	      }

	      if ( $this.attr("data-lang") == key && $this.hasClass('reset') ){ //separately for the "reset" button
	      	$this.val(value);
	      }
	    });
	  });
	};

	return {
		init : setUpListeners()
	}	

}());

$(document).ready(function(){
	lang.init();
});
