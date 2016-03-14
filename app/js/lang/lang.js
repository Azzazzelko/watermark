var lang = (function(){		//== Languages change module
	var setUpListeners = function(){
		$(".languages-ru, .languages-eng").on("click", getJson);	//Clicking on the button RU\ENG
	}

	function getJson(){		//== Function receiving JSON file
		var $this = $(this),
			url = $this.data("lang-url");

		$this.addClass('language_active').siblings($this).removeClass('language_active');

		$.getJSON(url, function(data){
			changeLang(data);
		});
	};

	function changeLang(data){	//== Function replacement text into the appropriate language
		var currentLang = data,	//Selected language = selected json 
		  	langItems = $("[data-lang]"); //All items containing the attribute "data-lang"

		langItems.each(function(){ //Loop through each of them ..
			var $this = $(this);

			$.each(currentLang, function(key, value){  //Loop through our JSON object
				if ( $this.attr("data-lang") == key ){ 
					if ( $this.attr("data-change") == "false" ) //If true, so there is the image name and we are not changing
						$this.html(value);

					if ( $this.attr("data-change") == undefined ) //If the attribute of our element coincides with the key in the object and does not have data-change, change its contents to value
						$this.html(value);
				};

			});
		});
	};

	return {
		init : setUpListeners()
	}	

}());

$(document).ready(function(){
	lang.init;
});
