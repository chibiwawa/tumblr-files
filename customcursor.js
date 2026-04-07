var $cursor = $('#custom-cursor');

$(document).on('mousemove', function(e) {
    $cursor.css({
        left: e.clientX + 'px',
        top: e.clientY + 'px'
    });
});

$(document).on('mouseenter', 'a, button, .like_button iframe, li.post img', function() {
    $cursor.addClass('hovered');
});

$(document).on('mouseleave', 'a, button, .like_button iframe, li.post img', function() {
    $cursor.removeClass('hovered');
});
