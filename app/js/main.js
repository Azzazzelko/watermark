//all params
var vars = {
	contWidth : 651,
	contHeight : 534,
	imgUrl : 0,
	imgAbsWidth : 0,
	imgAbsHeight: 0,
	imgRelWidth: 0,
	imgRelHeight: 0,
	imgTop: 0,
	imgLeft: 0,
	markUrl : 0,
	markAbsWidth: 0,
	markAbsHeight: 0,
	markRelWidth: 0,
	markRelHeight: 0,
	markTop: 0,
	markLeft: 0,
	markOpacity: 1
};

var $cont = $('.container-img');
var $imgWrap = $('.img-wrap');
var $img = $('.item-img');
var $mark = $('.watermark-img');

$( document ).ready(function() {

	var photoWidth = 2000;
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
            vars.markOpacity=jQuery("#slider").slider("value");

        },
        slide: function(event, ui){
            vars.markOpacity=jQuery("#slider").slider("value");
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
                } else { inputValue!= inputValue++; }
                input.val(inputValue);
            }
    }
    function validateValues(value,axis) {
        var max;
        if (axis=='Y') {max=vars.imgRelHeight;}
            else { max=vars.imgRelWidth;      }
        if(value>=0 && value<=max)   {return true;}
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

		$.ajax({
			type: "POST",
			url: 'php/create-img.php',
			data: vars,
			dataType: 'json'
		}).done(function( data ) {
            downloadResImg(data.result);
			console.log(data);
		});
	});

    function downloadResImg(response) {
        var href = 'php/download-img.php?file='+response;
        window.downloadFile = function(url) {
        window.open(url, '_self');
    }
        window.downloadFile(href);
    };
});