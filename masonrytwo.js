$(document).ready(function() {
    var $container = $('#posts');

    if (!$container.length || $container.find('li.post').length === 0) return;

    $container.masonry({
        itemSelector: 'li.post'
    });

    var $allImages = $container.find('img');
    var imgLoaded = 0;
    var imgTotal = $allImages.length;

    function onImageReady() {
        imgLoaded++;
        if (imgLoaded >= imgTotal) {
            $container.masonry('layout');
        }
    }

    if (imgTotal === 0) {
        $container.masonry('layout');
    } else {
        $allImages.each(function() {
            if (this.complete) {
                onImageReady();
            } else {
                $(this).on('load error', function() {
                    onImageReady();
                });
            }
        });
    }
});
