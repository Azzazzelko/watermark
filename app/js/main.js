 
$( document ).ready(function() {
    
    $("#slider").slider({
//        range: true
 
    });
    
    $('.social-item-like').on("click", function(e){ // социальные кнопки
        e.stopPropagation();
        $('.social-list').toggleClass('active');
    });
});

