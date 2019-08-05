$(document).ready(function(){
   
    new WOW().init();

    var width = $(window).width();
    if(width <= 768){
        $(".hex").removeClass("wow bounceIn bounceInLeft bounceInRight");
    }

    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html, body').animate({
                scrollTop: target.offset().top
                }, 700);
                return false;
            }
        }
    });
});


function initMap() {
    var pict = {lat: 18.4575421,lng: 73.85083359999999};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: pict
    });
    var marker = new google.maps.Marker({
      position: pict,
      map: map
    });
}

