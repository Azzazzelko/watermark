var WaterMarkModule = (function(){
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
		imgValid: false,
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

		markMarginX: 0, // расстояния между размноженными марками
		markMarginY: 0,
		markWrapOffsetX:0,  // смещения блока с размноженными марками относительно блока с картинкой
		markWrapOffsetY:0,
		markValid: false,
		background_tmp:0,
		watermark_tmp:0,
		activeMode: 'one'

	};

	var markOne= {
		top: 0,
		left: 0,
		limitTop:0,
		limitLeft:0,
		eq : "topL"
	};

	var markMany = {
		limitX : 100,
		limitY : 100,
		marginX : 10,
		marginY : 10,
		top : 0,
		left : 0,
		countX : 0,
		countY : 0
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

	var $cont = $('.container-img');
	var $imgWrap = $('.img-wrap');
	var $img = $('.item-img');
	var $mark = $('.watermark-img');

	var photoWidth = 2000;
	var imgInput=$('#background');
	var watermarkInput=$('#watermark');
	var formBlock=watermarkInput.closest('.container-form');
	var formBlockSiblings=formBlock.siblings('.container-form, .container-button');
	var alreadyCreate = false;

	(function setUpListeners(){ //сбор некоторых событий..
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
			}	//слайдер
		});

		$(".reset").on("click", function(e){
			e.preventDefault();
			resetAllSettings();	//нажатие на ресет
		});

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

		(function clickSpinner(){
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
		})();

		$('.download').on("click", function(e){	//события при клацанье на загрузку
			e.preventDefault();
			setCurrentModeParams();
			downloadAnimation();
			$.ajax({
				type: "POST",
				url: 'php/create-img.php',
				data: vars,
				dataType: 'json'
			}).done(function( data ) {
				downloadResImg(data.result);
				downloadAnimationRemove();
			});
		});

		$(".coordinates-value").on("keydown", function(e){	//событие, запрещает ввод чего-либо в инпуты
			e.preventDefault();
		});

		$(".item-img").on("dragstart", function(e){	//событие, что б в базовой картинке не бралась зеркальная копия
			e.preventDefault();
		});

	})();

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
	};

	function setLimits() {
		markOne.limitTop=Math.round(vars.imgRelHeight-vars.markRelHeight);
		markOne.limitLeft=Math.round(vars.imgRelWidth-vars.markRelWidth);
	};

	function createMarkRepeatBg(){

		var $markWrap = $('.watermark-wrap');
		var $mark = $('.watermark-img');

		var countX = 1 + Math.ceil(vars.imgRelWidth / (vars.markRelWidth + vars.markMarginX))*2;
		var countY = 1 + Math.ceil(vars.imgRelHeight / (vars.markRelHeight + vars.markMarginY))*2;

		var markWrapWidth = (countX) * (vars.markRelWidth + markMany.marginX);
		var markWrapHeight = (countY) * (vars.markRelHeight + markMany.marginY);

		markMany.countY = countY;
		markMany.countX = countX;

		$markWrap.css({
			'width': markWrapWidth,
			'height': markWrapHeight,
			'top': (markMany.top == 0) ? markMany.top - (markWrapHeight/3) : markMany.top,     //чтоб новая становилась в нужную позицию, а старая сохранялась нормально при переключении. Значение зависит от границ дропа
			'left': (markMany.left == 0) ? markMany.left - (markWrapWidth/3) : markMany.left
		});


		$mark.css({
			'margin-right' : markMany.marginX,
			'margin-bottom' : markMany.marginY
		});
		for (var i = 1, j = countX * countY; i < j; i++) {
			var clone = $mark.clone();
			clone.addClass('markClone');
			$markWrap.append(clone);
		}
	};

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
			'top': markOne.top,
			'transform': 'none',
			'left': markOne.left
		});

		$mark.css({
				'margin-right' : 0,
				'margin-bottom' : 0
			});
		$('.markClone').remove();
	};

	function resetAllSettings(){
		resetOpacity()
		$(".color-block").eq(0).click();
		markMany.marginX = 10;
		markMany.marginY = 10;
		markMany.top = 0;
		markMany.left = 0;

		if ( vars.activeMode != 'one' ){
			$('.active-color').removeClass('active-color');
			$('.markClone').remove();
			createMarkRepeatBg();
			$(".container-coordinates").find("[name='x-coordinates']").val(markMany.marginX);
			$(".container-coordinates").find("[name='y-coordinates']").val(markMany.marginY);
			$('.active-color-horizontal-field').css("height", "10px");
			$('.active-color-vertical-field').css("width", "10px");
		};
	};

	function resetOpacity(){
			$('#slider').slider({value:-1});
			$('.watermark-wrap').css('opacity', "1");
	};

	function setOpacity(){
		$('.watermark-wrap').css({'opacity' : vars.markOpacity});
	};

	function setCurrentModeParams(){
		if (vars.activeMode=='one') {
			vars.markTop= Math.floor(markOne.top/vars.imgRelCoef);
			vars.markLeft= Math.floor(markOne.left/vars.imgRelCoef);

		}else{
			vars.markMarginX = Math.floor(markMany.marginX/vars.imgRelCoef);
			vars.markMarginY = Math.floor(markMany.marginY/vars.imgRelCoef);
			vars.markWrapOffsetX = Math.floor(markMany.left/vars.imgRelCoef);
			vars.markWrapOffsetY = Math.floor(markMany.top/vars.imgRelCoef);
		};
	};

	function watermarkType($this){
		vars.activeMode=$this.val();
		var inputX = $(".container-coordinates").find("[name='x-coordinates']"),
			inputY = $(".container-coordinates").find("[name='y-coordinates']");

		if (vars.activeMode=='one') {
			$('.orientacion-field').hide();
			if (vars.imgUrl!=0 && vars.markUrl!=0) { // защита от возможности появления двох активных стандартных позиций
				$("[data-default=" + markOne.eq + "]").addClass('active-color').siblings('.color-block').removeClass('active-color');
			 } else {
				$('.color-block:eq(0)').addClass('active-color');
			 }
			createMarkOneBg();
			returnPositionFirstMode();
			$(".container-color-block .disabler__block").remove();
			alreadyCreate = false;
		} else {
			$('.active-color').removeClass('active-color');
			$('.orientacion-field').show();

			inputX.val( parseInt(markMany.marginX) );
			inputY.val( parseInt(markMany.marginY) );

			if (!alreadyCreate){
				var disableBlock="<div class='disabler__block' style='opacity: 0'></div>";
				$(".container-color-block").append(disableBlock);
				createMarkRepeatBg()
			};

			alreadyCreate = true;
		}
	};

	function emptyFileField(){ // проверка на наличие значения в fileFields
        if (vars.imgValid ==false || vars.markValid==false) {
            if (vars.imgValid==false && vars.markValid==false) {
                disableListeners();
            }
            return true;
        } else  {
            inputListeners();
        }
    };

	function disableListeners(){    // отключает все обработчики кроме тех которые в fileFields
		formBlockSiblings.each(function(){
			var disableBlock="<div class='disabler__block'></div>";
			$(this).append(disableBlock);
			$('#slider').slider({value:-1})
		});
	};

	function inputListeners(){
		$('.color-block').on('click', function(){
			putDefaultPositions($(this));
			markOne.eq = $(this).data("default");
		});

		$('.view,.view[value=one]').on('click',function(){
			watermarkType($(this));
		});

		$('.disabler__block').remove();
		// триггер для того чтобы после снятия блокировки включался одиночный режим
		$('.view[value=one]').click();
	};

	function fileinputListeners(){
		disableListeners();
		$('.form').on('change','#background, #watermark',function(){
			emptyFileField(imgInput,watermarkInput);
		})
	};

	function returnPositionFirstMode(){
		$('input[name=x-coordinates]').val(markOne.left);
		$('input[name=y-coordinates]').val(markOne.top);
	};

	function putDefaultPositions(element){
		$('.active-color').removeClass('active-color');
		element.addClass('active-color');

		element=element.data('default');
		element=String(element);
		markOne.top=defaultPosition[element][0];
		markOne.left=defaultPosition[element][1];
		$('.watermark-wrap').css({'top':defaultPosition[element][0] ,'left':defaultPosition[element][1] });
		$('input[name=x-coordinates]').val(defaultPosition[element][1]);
		$('input[name=y-coordinates]').val(defaultPosition[element][0]);
	};

	function findInput(input){
		var parent=input.closest('.container-coordinates');
		return parent.find('input');
	};

	function changePosition(value,direction){
		markOne[direction]=value;
		$('.watermark-wrap').css(direction,value);
	};

	function changeMargin(value, direction, action, edgeValue){     //управление изменением ширины\высоты\маржинов второго режима
		if (direction == "margin-bottom"){
			var oldHorizontal = $('.active-color-horizontal-field').css("height");
				oldHeight = $('.watermark-wrap').css("width");
			if (edgeValue != true){
				var newHorizontal = (action == "increment") ? parseInt(oldHorizontal) + 1 + "px" : parseInt(oldHorizontal) + -1 + "px";
				var newHeight = (action == "increment") ? parseInt(oldHeight) + (1*markMany.countX) + "px" : parseInt(oldHeight) + (-1*markMany.countX) + "px";

				$('.watermark-wrap').css("width", newHeight);
				$('.active-color-horizontal-field').css("height", newHorizontal);
				markMany.marginY = value;
			}else{
				return;
			};
		}else{
			var oldVertical = $('.active-color-vertical-field').innerWidth();
				oldWidth = $('.watermark-wrap').css("width");
			if (edgeValue != true){
				var newVertical = (action == "increment") ? parseInt(oldVertical) + 1 + "px" : parseInt(oldVertical) + -1 + "px";
				var newWidth = (action == "increment") ? parseInt(oldWidth) + (1.5*markMany.countX) + "px" : parseInt(oldWidth) + (-1.5*markMany.countX) + "px";

				$('.active-color-vertical-field').css("width", newVertical);
				$('.watermark-wrap').css("width", newWidth);
				markMany.marginX = value;
			}else{
				return;
			};
		};
		$('.watermark-img').css(direction,value);
	};

	function changeValue($this){
		var input=findInput($this);
		var axis=input.data('direction');
		var action=$this.data('action');
		var max;
		var justDoIt;
		if (vars.activeMode=='one'){
			axis=='y' ? max=markOne.limitTop : max=markOne.limitLeft;
			axis=='y' ? axis='top' : axis='left';
		}else{
			axis=='y' ? max=markMany.limitY : max=markMany.limitX;
			axis=='y' ? axis='margin-bottom' : axis='margin-right';
		};
		var edgeValue;
		var inputValue=parseInt(input.val(),10);
			if(inputValue>=0 && inputValue<=max) {
				if (action=='decrement') {
					inputValue!=0 ? inputValue-- : edgeValue=true;
					} else {
						inputValue!=max ? inputValue++ : edgeValue=true ;
							}
				input.val(inputValue);
				justDoIt = (vars.activeMode=='one') ? changePosition(inputValue,axis) : changeMargin(inputValue,axis,action,edgeValue);
				if (edgeValue==true) {return false };
				return true;
			}
	};

	//*********drag and drop**********//

	var draggable = $(".watermark-wrap")[0],
		dragContainer = $(".img-wrap")[0];

	$(draggable).on("mousedown", function(e){
		var coords = getCoords(draggable),
			coordsContainer = getCoords(dragContainer);
		var shiftX = e.pageX - coords.left,
			shiftY = e.pageY - coords.top;

		$(document).on("mousemove", function(e){
		  moveIt(e);
		  $("body").css("cursor", "move");
		});

		$(document).on("mouseup", function(e){
		  var $this = $(this);

		  $(document).off("mousemove");
		  $this.off("mouseup");
		  $(draggable).css("cursor", "pointer");
		  $("body").css("cursor", "default");
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
		};

		function moveIt(e) {
			if ( vars.activeMode == "one" ){
				var borderLeft = e.pageX - shiftX < coordsContainer.left,
					borderTop = e.pageY - shiftY < coordsContainer.top,
					borderRight = e.pageX + (draggable.offsetWidth - shiftX) > coordsContainer.right,
					borderBottom = e.pageY + (draggable.offsetHeight - shiftY) > coordsContainer.bottom;

				var inputX = $(".container-coordinates").find("[name='x-coordinates']"),
					inputY = $(".container-coordinates").find("[name='y-coordinates']");

				$(draggable).css({
					"left" : borderLeft ? 0
						   : borderRight ? dragContainer.offsetWidth - draggable.offsetWidth
						   : e.pageX - coordsContainer.left - shiftX,
					"top" : borderTop ? 0
						  : borderBottom ? dragContainer.offsetHeight - draggable.offsetHeight
						  : e.pageY - coordsContainer.top - shiftY,
					"cursor" : "move"
				});

				inputX.val( parseInt($(draggable).css("left")) );
				inputY.val( parseInt($(draggable).css("top")) );

				markOne.left = parseInt($(draggable).css("left"));
				markOne.top = parseInt($(draggable).css("top"));

			}else{
				var plusForBorderHeight = Math.round( draggable.offsetHeight/2 ),
                    plusForBorderWidth = Math.round( draggable.offsetWidth/2 ), 
                    borderLeft = e.pageX - shiftX < coordsContainer.left - plusForBorderWidth,
                    borderTop = e.pageY - shiftY < coordsContainer.top - plusForBorderHeight,
                    borderRight = e.pageX + (draggable.offsetWidth - shiftX) > coordsContainer.right + plusForBorderWidth,
                    borderBottom = e.pageY + (draggable.offsetHeight - shiftY) > coordsContainer.bottom + plusForBorderHeight;

				$(draggable).css({
					"transform" : "none",
					"left" : borderLeft ? -plusForBorderWidth
						   : borderRight ? dragContainer.offsetWidth + plusForBorderWidth - draggable.offsetWidth
						   : e.pageX - coordsContainer.left - shiftX,
					"top" : borderTop ? -plusForBorderHeight
						  : borderBottom ? dragContainer.offsetHeight + plusForBorderHeight - draggable.offsetHeight
						  : e.pageY - coordsContainer.top - shiftY,
					"cursor" : "move"
				});

				markMany.left = parseInt($(draggable).css("left"));
				markMany.top = parseInt($(draggable).css("top"));
			}
		};
	});

	//*****drag end...............//

	function downloadAnimation(){
		var animation = "<div class='download-animation'><div class='circle'></div><div class='circle1'></div></div>";
		$imgWrap.append(animation);
	};

	function downloadAnimationRemove(){
		$(".download-animation").remove();
	};
	
	function downloadResImg(response){
		var href = 'php/download-img.php?file='+response;
		window.downloadFile = function(url) {
			window.open(url, '_self');
		};
		window.downloadFile(href);
	};

	return {
        emptyFileField: emptyFileField,
        setLimits: setLimits,
        setDefaultPosition: setDefaultPosition,
        resetAllSettings: resetAllSettings,
        createMarkOneBg: createMarkOneBg,
        variables: {
            mark: $mark,
            img: $img,
            imgWrap: $imgWrap,
            vars: vars
        }
    }

})();

$( document ).ready(function() {
    WaterMarkModule.emptyFileField();
});