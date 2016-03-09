//all params
var vars = {
	contWidth : 651,
	contHeight : 534,
	imgUrl : 0,
	imgAbsWidth : 0,
	imgAbsHeight: 0,
	imgRelWidth: 0,
	imgRelHeight: 0,
    imgRelCoef: 0, // rel/abs  (0..1)
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

    markMarginX: 10, // расстояния между размноженными марками
    markMarginY: 10,
    markWrapOffsetX:0,  // смещения блока с размноженными марками относительно блока с картинкой
    markWrapOffsetY:0,

    activeMode: 'one'
};

var markOne= {
    top: 0,
    left: 0,
    limitTop:0,
    limitLeft:0
};
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
};
    function setDefaultPosition() {// 1-е значение = top, 2-е значение = left
            var centerTop=(vars.imgRelHeight/2)-(vars.markRelHeight/2);
            var centerLeft=(vars.imgRelWidth/2)-(vars.markRelWidth/2);

            centerLeft=Math.round(centerLeft);
            centerTop=Math.round(centerTop);

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
        markOne.limitTop=Math.round(vars.imgRelHeight-vars.markRelHeight);
        markOne.limitLeft=Math.round(vars.imgRelWidth-vars.markRelWidth);
    }




var $cont = $('.container-img');
var $imgWrap = $('.img-wrap');
var $img = $('.item-img');
var $mark = $('.watermark-img');



function createMarkRepeatBg(){

    var $markWrap = $('.watermark-wrap');
    var $mark = $('.watermark-img');

    var countX = 1 + Math.round(vars.imgRelWidth / (vars.markRelWidth + vars.markMarginX));
    var countY = 1 + Math.round(vars.imgRelHeight / (vars.markRelHeight + vars.markMarginY));

    var markWrapWidth = (countX) * (vars.markRelWidth + vars.markMarginX);
    var markWrapHeight = ( countY) * (vars.markRelHeight + vars.markMarginY);

    vars.markWrapOffsetX = Math.round((vars.imgRelWidth - markWrapWidth) / 2);
    vars.markWrapOffsetY = Math.round((vars.imgRelHeight - markWrapHeight) / 2);

    $markWrap.css({
        'width': markWrapWidth,
        'height': markWrapHeight,
        'top': '50%',
        'transform': 'translate(-50%, -50%)',
        'left': '50%'
    });


    $mark.css({
        'margin-right' : vars.markMarginX,
        'margin-bottom' : vars.markMarginY
    });
    for (var i = 1, j = countX * countY; i < j; i++) {
        var clone = $mark.clone();
        clone.addClass('markClone');
        $markWrap.append(clone);
    }

}
function updateMarginsMarkRepeatBg(){
    var $markWrap = $('.watermark-wrap');
    
    $($markWrap).find('img').css({
        'margin-right' : vars.markMarginX,
        'margin-bottom' : vars.markMarginY
    });
}
function createMarkOneBg(){

    var $markWrap = $('.watermark-wrap');
    var $mark = $('.watermark-img');

    var countX = 0;
    var countY = 0;

    var markWrapWidth = vars.markRelWidth;
    var markWrapHeight = vars.markRelHeight;

    vars.markWrapOffsetX = 0;
    vars.markWrapOffsetY = 0;

    $markWrap.css({
        'width': markWrapWidth,
        'height': markWrapHeight,
        'top': 0,
        'transform': 'none',
        'left': 0
    });

    $mark.css({
            'margin-right' : 0,
            'margin-bottom' : 0
        });
    $('.markClone').remove();

}


$( document ).ready(function() {

	var photoWidth = 2000;
    var imgInput=$('#background');
    var watermarkInput=$('#watermark');
    var formBlock=watermarkInput.closest('.container-form');
    var formBlockSiblings=formBlock.siblings('.container-form, .container-button');

    $("#slider").slider({
        range: 'min',
        min: -1,
        max: 0,
        step: 0.01,
        value: vars.markOpacity,
        stop: function(event, ui) {
            vars.markOpacity=jQuery("#slider").slider("value")*(-1);
            setOpacity();
        },
        slide: function(event, ui){
            vars.markOpacity=jQuery("#slider").slider("value")*(-1);
            setOpacity();
        }
    });

    function setOpacity(){
        $('.watermark-wrap').css({'opacity' : vars.markOpacity});
    }

    function setCurrentModeParams(){
        if (vars.activeMode=='one') {
            vars.markTop= Math.floor(markOne.top/vars.imgRelCoef);
            vars.markLeft= Math.floor(markOne.left/vars.imgRelCoef);

        } else  {
                    // после создания режима замощения допишу заполнение нужных параметров
                }
    };

    function watermarkType($this){
        vars.activeMode=$this.val();
        if (vars.activeMode=='one') {
            $('.orientacion-field').hide();
            if (vars.imgUrl!=0 && vars.markUrl!=0) { // защита от возможности появления двох активных стандартных позиций
                $('.color-block:eq(0)').click();
             } else {
                $('.color-block:eq(0)').addClass('active-color');
             }
            createMarkOneBg();
        } else {
            $('.active-color').removeClass('active-color');
            $('.orientacion-field').show();

            createMarkRepeatBg();




        }
    }

    function emptyFileField(background,watermark) { // проверка на наличие значения в fileFields
        background=background.val();
        watermark=watermark.val();
        if (background=='' || watermark=='') {
            if (background=='' && watermark=='') {
                disableListeners();
            }
            return true;
        } else  {
            inputListeners();
        }
    }
    function disableListeners(){    // отключает все обработчики кроме тех которые в fileFields
        formBlockSiblings.each(function(){
            var disableBlock="<div class='disabler__block'></div>";
            $(this).append(disableBlock);
            $('#slider').slider({value:-1})
        });
    }

    function inputListeners(){
            $('.switch-container').on('click','.up, .down', function(){
                changeValue($(this));
            });
            var TimeOutGlobal;  // ID для timeOut
            var TimeOutInner;   // ID для timeOut
            $('.switch-container').on('mousedown','.up, .down', function(){
                var $this=$(this);
                TimeOutGlobal = setTimeout(function(){
                    var i=100; // регилирует таймер
                    TimeOutInner = setTimeout(function tick() {
                        i>=10 ? i=i-2 : '';
                        var result = changeValue($this);
                        if (!result) { $('.switch-container').mouseup(); } // если результат будет false значит у нас достигнуто последнее из возможных значений, поетому мы преклащаем рекурсию таймаута, делаем триггер mouseup
                            else {
                                TimeOutInner = setTimeout(tick, i); // иначе мы спокойно может использовать рекурсивный таймаут и дальше изменять значения полей
                            }
                    }, i);
                },500);
            });
            $('.switch-container').on('mouseup','.up, .down', function(){
                clearTimeout(TimeOutInner);
                clearTimeout(TimeOutGlobal);
            });

            $('.color-block').on('click', function(){
                putDefaultPositions($(this));
            });
            $('.view,.view[value=one]').on('click',function(){

                watermarkType($(this));
            });

            $('.disabler__block').remove();
            // триггер для того чтобы после снятия блокировки включался одиночный режим
            $('.view[value=one]').click();
       }

    function fileinputListeners() {
        disableListeners();
        $('.form').on('change','#background, #watermark',function(){
            emptyFileField(imgInput,watermarkInput);
        })
    }

    function putDefaultPositions(element) {
        $('.active-color').removeClass('active-color');
        element.addClass('active-color');

        element=element.data('default');
        element=String(element);
        markOne.top=defaultPosition[element][0];
        markOne.left=defaultPosition[element][1];
        $('.watermark-wrap').css({'top':defaultPosition[element][0] ,'left':defaultPosition[element][1] });
        $('input[name=x-coordinates]').val(defaultPosition[element][1]);
        $('input[name=y-coordinates]').val(defaultPosition[element][0]);

    }
    function findInput(input) {
        var parent=input.closest('.container-coordinates');
        return parent.find('input');
    }


    function changePosition(value,direction){
        markOne[direction]=value;
        $('.watermark-wrap').css(direction,value);
    }

    function changeValue($this) {
        var input=findInput($this);
        var axis=input.data('direction');
        var action=$this.data('action');
        var max;
        axis=='y' ? max=markOne.limitTop : max=markOne.limitLeft;
        axis=='y' ? axis='top' : axis='left' ;
        var edgeValue;
        var inputValue=parseInt(input.val(),10);
            if(inputValue>=0 && inputValue<=max) {
                if (action=='decrement') {
                    inputValue!=0 ? inputValue-- : edgeValue=true;
                    } else {
                        inputValue!=max ? inputValue++ : edgeValue=true ;
                            }
                input.val(inputValue);
                changePosition(inputValue,axis);
                if (edgeValue==true) {return false };
                return true;
            }


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

    //*********drag and drop**********//

    //var draggable = $(".watermark-img")[0];
    var draggable = $(".watermark-wrap")[0];


    $(draggable).on("mousedown", function(e){
        var coords = getCoords(draggable),
            coordsContainer = getCoords($(".img-wrap")[0]);
        var shiftX = e.pageX - coords.left,
            shiftY = e.pageY - coords.top;

        $(document).on("mousemove", function(e){
          moveIt(e);
        });

        $(document).on("mouseup", function(e){
          var $this = $(this);

          $(document).off("mousemove");
          $this.off("mouseup");
          $(draggable).css("cursor", "pointer");
        });

        $(draggable).on("dragstart", function(e){
          e.preventDefault();
        });

        function getCoords(elem) {
            var box = elem.getBoundingClientRect();

            return {
              top: box.top + pageYOffset,
              left: box.left + pageXOffset,
              right: box.right + pageXOffset,
              bottom: box.bottom + pageYOffset
            };
        }

        function moveIt(e) {
          var borderLeft = e.pageX - shiftX < coordsContainer.left,
              borderTop = e.pageY - shiftY < coordsContainer.top,
              borderRight = e.pageX + (draggable.offsetWidth - shiftX) > coordsContainer.right,
              borderBottom = e.pageY + (draggable.offsetHeight - shiftY) > coordsContainer.bottom,
              inputX = $(".container-coordinates").find("[name='x-coordinates']"),
              inputY = $(".container-coordinates").find("[name='y-coordinates']");

          $(draggable).css({
            "left" : borderLeft ? 0
                   : borderRight ? $(".img-wrap")[0].offsetWidth - draggable.offsetWidth
                   : e.pageX - coordsContainer.left - shiftX,
            "top" : borderTop ? 0
                  : borderBottom ? $(".img-wrap")[0].offsetHeight - draggable.offsetHeight
                  : e.pageY - coordsContainer.top - shiftY,
            "cursor" : "move"
          });


          inputX.val( parseInt($(draggable).css("left")) );
          inputY.val( parseInt($(draggable).css("top")) );

          markOne.left = parseInt($(draggable).css("left"));
          markOne.top = parseInt($(draggable).css("top"));

        }

      });

    //*****drag end...............//

	$('.download').on("click", function(e){
		e.preventDefault();
        setCurrentModeParams();
		$.ajax({
			type: "POST",
			url: 'php/create-img.php',
			data: vars,
			dataType: 'json'
		}).done(function( data ) {
            downloadResImg(data.result);
		});
	});

    function downloadResImg(response) {
        var href = 'php/download-img.php?file='+response;
        window.downloadFile = function(url) {
            window.open(url, '_self');
        };
        window.downloadFile(href);
    };

});