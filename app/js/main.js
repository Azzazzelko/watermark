
$( document ).ready(function() {
	var photoWidth = 2000;
	var Ymax=5;
    var Xmax=200;
    var opacity; // в переменно перезаписываеться значение нашей прозрачности из слайдера
    var imgInput=$('#background');
    var watermarkInput=$('#watermark');
    var formBlock=watermarkInput.closest('.container-form');
    var formBlockSiblings=formBlock.siblings('.container-form, .container-button');

    $("#slider").slider({
        min: 0,
        max: 100,
        value: 0,
        range: "min",
        stop: function(event, ui) {
            opacity=jQuery("#slider").slider("value");

        },
        slide: function(event, ui){
            opacity=jQuery("#slider").slider("value");
        }
    });

    function watermarkType($this){
        if ($this.val()=='one') {
            $('.active-color-horizontal-field, .active-color-vertical-field').hide();
            $('.color-block:eq(0)').addClass('active-color');
        } else {
            $('.active-color').removeClass('active-color');
            $('.active-color-horizontal-field, .active-color-vertical-field').show();

        }
    }

    function emptyFileField(background,watermark) { // проверка на наличие значения в fileFields
        background=background.val();
        watermark=watermark.val();
        if (background=='' || watermark=='') {
            disableListeners();
            return true;
        }
        inputListeners();
    }
    function disableListeners(){    // отключает все обработчики кроме тех которые в fileFields
        formBlockSiblings.each(function(){
            var disableBlock="<div class='disabler__block'></div>";
            $(this).append(disableBlock);
            $('#slider').slider({value:0})
        });
    }
    function inputListeners(){
            $('.up').on('click', function(){
                changePosition($(this),'Y','plus');
            })
            $('.down').on('click', function(){
                changePosition($(this),'Y','minus');
            })
            $('.color-block').on('click', function(){
                defaultPosition($(this));
            })
            $('.view').on('click',function(){
                watermarkType($(this));
            })

            $('.disabler__block').remove();
            $('.view').triggerHandler('click', function(){ alert('fghgfh'); watermarkType($('.view:checked'))  });
       }

    function fileinputListeners() {
        disableListeners();
        $('.form').on('change','#background, #watermark',function(){
            emptyFileField(imgInput,watermarkInput);
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
        if (axis=='Y') {max=Ymax;}
            else { max=Xmax;      }
        if(value>=0 && value<max)   {return true;}
            else { return false;}
    }

    fileinputListeners();

    $('.social-item-like').on("click", function(e){ // социальные кнопки
        e.stopPropagation();
        $('.social-list').toggleClass('active');
    });
    
    (function(){ // поделиться в соц сетях
        $('.social-link-fb').on("click", function(e){
            window.open('http://www.facebook.com/sharer.php?u=' + document.location, 'a', "width=800,height=400");
        });
        
        $('.social-link-tw').on("click", function(e){
            window.open('http://twitter.com/share?url=' + document.location, 'a', "width=800,height=400");
        });
        
        $('.social-link-vk').on("click", function(e){
            window.open('http://vk.com/share.php?url=' + document.location, 'a', "width=800,height=400");
        });
        
    }());

	$('.download').on("click", function(e){
		e.preventDefault();
		var $img = $('.item-img');
		var $mark = $('.watermark-img');
		//console.log($img.attr('src'));
		var vars = {
			imgUrl : $img.attr('src'),
			imgAbsWidth : $img.data('abs-width'),
			imgAbsHeight: $img.data('abs-height'),
			imgRelWidth: $img.data('rel-width'),
			imgRelHeight: $img.data('rel-height'),
			imgTop: $img.data('top'),
			imgLeft: $img.data('left'),
			markUrl : $mark.attr('src'),
			markAbsWidth: $mark.data('abs-width'),
			markAbsHeight: $mark.data('abs-height'),
			markRelWidth: $mark.data('rel-width'),
			markRelHeight: $mark.data('rel-height'),
			markTop: $mark.data('top'),
			markLeft: $mark.data('left')
		};
		$.ajax({
			type: "POST",
			url: 'php/create-img.php',
			data: vars,
			dataType: 'json'
		}).done(function( data ) {
			console.log(data);
		});
	});
});