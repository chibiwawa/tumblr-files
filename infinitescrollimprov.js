$(document).ready(function() {
    var $container = $('#posts');

    if (!$container.length || $container.find('li.post').length === 0) return;
    if (typeof $.fn.infinitescroll === 'undefined') return;
    if (!$('.pagination #next').length) return;

    var hasMasonry = typeof $.fn.masonry !== 'undefined' && $container.data('masonry');

    $container.infinitescroll({
        navSelector:  '.pagination',
        nextSelector: '.pagination #next',
        itemSelector: 'li.post',
        bufferPx: 600,
        loading: {
            img: '',
            msgText: '<div class="loading-spinner"></div><em>loading...</em>'
        }
    }, function(newElements) {
        var $newElems = $(newElements);
        $newElems.css({ opacity: 0 });

        var images = $newElems.find('img');
        var loaded = 0;
        var total = images.length;

        function finish() {
            $newElems.animate({ opacity: 1 }, 400);
            if (hasMasonry) {
                $container.masonry('appended', $newElems);
            }
        }

        if (total === 0) {
            finish();
        } else {
            images.each(function() {
                if (this.complete) {
                    loaded++;
                    if (loaded >= total) finish();
                } else {
                    $(this).on('load error', function() {
                        loaded++;
                        if (loaded >= total) finish();
                    });
                }
            });
        }
    });
});

<!-- ============================== -->
