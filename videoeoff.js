if (window.location.href.indexOf('customize') > -1) {
    $('iframe[src*="tumblr.com/video"]').remove();
    $('.tumblr_video_container').remove();
    $('video').remove();
    $('iframe[src*="youtube.com"]').remove();
    $('iframe[src*="youtu.be"]').remove();
}
