(function() {
    var galleryImages = [];
    var currentIndex = 0;

    function showImage(index) {
        currentIndex = index;
        var src = galleryImages[index];
        var lightbox = document.getElementById('photo-lightbox');

        var oldImg = document.getElementById('lightbox-img');
        if (oldImg) {
            oldImg.src = '';
            oldImg.parentNode.removeChild(oldImg);
        }

        var newImg = document.createElement('img');
        newImg.id = 'lightbox-img';
        newImg.src = src;
        lightbox.insertBefore(newImg, lightbox.firstChild);

        if (galleryImages.length > 1) {
            document.getElementById('lightbox-prev').style.display = 'flex';
            document.getElementById('lightbox-next').style.display = 'flex';
            document.getElementById('lightbox-counter').style.display = 'block';
            document.getElementById('lightbox-counter').textContent = (index + 1) + ' / ' + galleryImages.length;
        } else {
            document.getElementById('lightbox-prev').style.display = 'none';
            document.getElementById('lightbox-next').style.display = 'none';
            document.getElementById('lightbox-counter').style.display = 'none';
        }
    }

    function closeLightbox() {
        var img = document.getElementById('lightbox-img');
        if (img) img.src = '';
        $('#photo-lightbox').css('display', 'none');
    }

    document.addEventListener('click', function(e) {
        var anchor = e.target.closest('a.post_media_photo_anchor');
        if (!anchor) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        var post = anchor.closest('li.post');
        var allImages = [];

        if (post) {
            var anchors = post.querySelectorAll('a.post_media_photo_anchor');
            for (var i = 0; i < anchors.length; i++) {
                var img = anchors[i].querySelector('img');
                var src = anchors[i].getAttribute('data-big-photo') || (img ? img.getAttribute('src') : null);
                if (src) allImages.push(src);
            }
        }

        if (allImages.length === 0) {
            var fb = anchor.querySelector('img');
            var fallback = anchor.getAttribute('data-big-photo') || (fb ? fb.getAttribute('src') : '');
            if (fallback) allImages.push(fallback);
        }

        galleryImages = allImages;
        var clickedImg = anchor.querySelector('img');
        var clickedSrc = anchor.getAttribute('data-big-photo') || (clickedImg ? clickedImg.getAttribute('src') : '');
        currentIndex = galleryImages.indexOf(clickedSrc);
        if (currentIndex === -1) currentIndex = 0;

        showImage(currentIndex);
        document.getElementById('photo-lightbox').style.display = 'flex';
        return false;
    }, true);

    $(document).on('click', 'img.lightbox-photo', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $grid = $(this).closest('.photoset-grid');
        if ($grid.length) {
            galleryImages = [];
            $grid.find('img.lightbox-photo').each(function() {
                galleryImages.push($(this).attr('data-highres') || $(this).attr('src'));
            });
            var clickedSrc = $(this).attr('data-highres') || $(this).attr('src');
            currentIndex = galleryImages.indexOf(clickedSrc);
            if (currentIndex === -1) currentIndex = 0;
        } else {
            galleryImages = [$(this).attr('data-highres') || $(this).attr('src')];
            currentIndex = 0;
        }

        showImage(currentIndex);
        $('#photo-lightbox').css('display', 'flex');
    });

    $('#lightbox-next').on('click', function(e) {
        e.stopPropagation();
        if (currentIndex < galleryImages.length - 1) showImage(currentIndex + 1);
        else showImage(0);
    });

    $('#lightbox-prev').on('click', function(e) {
        e.stopPropagation();
        if (currentIndex > 0) showImage(currentIndex - 1);
        else showImage(galleryImages.length - 1);
    });

    $('#lightbox-close').on('click', function() {
        closeLightbox();
    });

    $('#photo-lightbox').on('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });

    $(document).on('keydown', function(e) {
        if ($('#photo-lightbox').css('display') === 'none') return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') $('#lightbox-next').click();
        if (e.key === 'ArrowLeft') $('#lightbox-prev').click();
    });
})();
