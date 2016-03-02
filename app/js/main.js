 
$( document ).ready(function() {
    
    $("#slider").slider({
        range: "min"
    });
    
    $('.social-item-like').on("click", function(e){ // социальные кнопки
        e.stopPropagation();
        $('.social-list').toggleClass('active');
    });
});

