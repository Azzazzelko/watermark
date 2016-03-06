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
	markOpacity: 1,
    markTopLimit: 0,
    markLeftLimit: 0,
};

var markOne= {
    top: 0,
    left: 0,
    limitTop:0,
    limitLeft:0
}
var defaultPosition = {
    topL:[],
    topC:[],
    topR:[],
    centerL:[],
    centerC:[],
    centerR:[],
    bottomL:[],
    bottomC:[],
    bottomR:[]
}
    function setDefaultPosition() {// 1-е значение = top, 2-е значение = left
            var centerTop=(vars.imgRelHeight/2)-(vars.markRelHeight/2);
            var centerLeft=(vars.imgRelWidth/2)-(vars.markRelWidth/2);

            defaultPosition.topL=[0,0];
            defaultPosition.topC=[0,centerLeft];
            defaultPosition.topR=[0,markOne.limitLeft];

            defaultPosition.centerL=[centerTop,0];
            defaultPosition.centerC=[centerTop,centerLeft];
            defaultPosition.centerR=[centerTop,markOne.limitLeft];

            defaultPosition.bottomL=[markOne.limitTop,0];
            defaultPosition.bottomC=[markOne.limitTop,centerLeft];
            defaultPosition.bottomR=[markOne.limitTop,markOne.limitLeft];
    }
    function setLimits() {
        markOne.limitTop=(vars.imgRelHeight-vars.markRelHeight);
        markOne.limitLeft=(vars.imgRelWidth-vars.markRelWidth);
    }
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
            setOpacity(jQuery("#slider").slider("value"));

        },
        slide: function(event, ui){
            vars.markOpacity=jQuery("#slider").slider("value");
            setOpacity(jQuery("#slider").slider("value"));
        }
    });

    function setOpacity(value){
        value=parseInt(value, 10);
        value=value/100;
        $('.watermark-img').css({'opacity' : value});
    }

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

            $('.switch-container').on('click','.up, .down', function(){
                changeValue($(this));
            });
            var interval;
            $('.switch-container').on('mousedown','.up, .down', function(){
                var $this=$(this);
                interval = setInterval(function(){
                    changeValue($this,'plus');
                },100);
            });
            $('.switch-container').on('mouseup','.up, .down', function(){
                clearInterval(interval);
            });

            $('.color-block').on('click', function(){
                putDefaultPositions($(this));
            })
            $('.view').on('click',function(){
                watermarkType($(this));
            })

            $('.disabler__block').remove();
       }

    function fileinputListeners() {
        disableListeners();
        $('.form').on('change','#background, #watermark',function(){
            emptyFileField(imgInput,watermarkInput);
        })
    }

    function putDefaultPositions(element) {
        element=element.data('default');
        element=String(element);
        $('.watermark-img').css({'top':defaultPosition[element][0] ,'left':defaultPosition[element][1] });
        $('input[name=x-coordinates]').val(defaultPosition[element][0]);
        $('input[name=y-coordinates]').val(defaultPosition[element][1]);

    }
    function findInput(input) {
        var parent=input.closest('.container-coordinates');
        return parent.find('input');
    }


    function changePosition(value,direction){
        $('.watermark-img').css(direction,value);
    }

    function changeValue($this) {
        var input=findInput($this);
        var axis=input.data('direction');
        var action=$this.data('action');
        var max;
        axis=='y' ? max=markOne.limitTop : max=markOne.limitLeft;
        axis=='y' ? axis='top' : axis='left' ;
        var inputValue=parseInt(input.val(),10);
            if(validateValues(inputValue,max)) {
                if (action=='decrement') {
                    inputValue!=0 ? inputValue-- : inputValue=inputValue;
                    changePosition(inputValue,axis);
                } else { inputValue!=max ? inputValue++ : inputValue=inputValue ; }
                input.val(inputValue);
                    changePosition(inputValue,axis);
            }


    }
    function validateValues(inputValue,maxValue) {
        if(inputValue>=0 && inputValue<=maxValue)   { return true;}
            else { console.log('не прошло'); return false;}
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