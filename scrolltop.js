$(window).on('scroll', function() {
    if ($(this).scrollTop() > 300) $('.scroll-top').addClass('visible');
    else $('.scroll-top').removeClass('visible');
})
