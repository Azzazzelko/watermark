
$( document ).ready(function() {

	var Ymax=5;
    var Xmax=200;
    var opacity; // в переменно перезаписываеться значение нашей прозрачности из слайдера

    $("#slider").slider({

		min: 0,
		max: 100,
		value: 0,
		range: false,
		stop: function(event, ui) {
			opacity=jQuery("#slider").slider("value");
	    },
	    slide: function(event, ui){
			opacity=jQuery("#slider").slider("value");
	    }
	});

    function inputListeners() {
    	$('.up').on('click', function(){
    		changePosition($(this),'Y','plus');
    	})
    	$('.down').on('click', function(){
    		changePosition($(this),'Y','minus');
    	})
    	$('.color-block').on('click', function(){
    		defaultPosition($(this));
    	})

    }

    function defaultPosition(element) {   // будет задавать 9 стандарных позиций
    	// body...
    }
    function findInput(input) {
    	var parent=input.closest('.container-coordinates');
    	return parent.find('input');
    }

    function changePosition($this,axis,action) {
    	var input=findInput($this);
    	var inputValue=input.val();
    		if(validateValues(inputValue,axis)) {
    			if (action=='minus') {
    				inputValue!=0 ? inputValue-- : inputValue;
    			} else { inputValue++; }
	    		input.val(inputValue);
    		}
    }
    function validateValues(value,axis) {
    	var max;
    	switch (axis) {
    		case 'Y': 	max=Ymax;
    					break;
    		case 'X': 	max=Xmax;
    					break;
    		default: alert('Ось не задана');
    	}
    	if(value>=0 && value<max)	{return true;}
    		else { return false;}
    }

    inputListeners();



    $('.social-item-like').on("click", function(e){ // социальные кнопки
        e.stopPropagation();
        $('.social-list').toggleClass('active');
    });
});


