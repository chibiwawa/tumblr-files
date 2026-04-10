// ========== CUSTOMIZE MODE CLEANUP ==========
if (window.location.href.indexOf('customize') > -1) {
    $('iframe[src*="tumblr.com/video"]').remove();
    $('.tumblr_video_container').remove();
    $('video').remove();
    $('iframe[src*="youtube.com"]').remove();
    $('iframe[src*="youtu.be"]').remove();
}

// ========== LOADING SCREEN ==========
window.addEventListener('load', function() {
    var loader = document.getElementById('loading-screen');
    if (loader) {
        setTimeout(function() {
            loader.classList.add('fade-out');
            setTimeout(function() {
                if (loader.parentNode) loader.parentNode.removeChild(loader);
                document.body.classList.add('page-ready');
            }, 600);
        }, 800);
    }
});

// ========== EXIT SCREEN ==========
$(document).on('click', 'a[href*="tumblr.com"]', function(e) {
    var url = this.href;
    if (url.includes(window.location.hostname) || this.target === '_blank') return;
    e.preventDefault();
    var exit = document.getElementById('exit-screen');
    exit.style.display = 'flex';
    requestAnimationFrame(function() { exit.classList.add('visible'); });
    setTimeout(function() { window.location.href = url; }, 500);
});

// ========== SCROLL TO TOP ==========
$(window).on('scroll', function() {
    if ($(this).scrollTop() > 300) $('.scroll-top').addClass('visible');
    else $('.scroll-top').removeClass('visible');
});

// ========== MOBILE MENU ==========
function toggleMobileMenu() {
    var menu = document.querySelector('ul.sidelinks');
    var btn = document.querySelector('.mobile-menu-toggle');
    if (menu.classList.contains('menu-open')) {
        menu.classList.remove('menu-open');
        btn.textContent = 'open navigation';
    } else {
        menu.classList.add('menu-open');
        btn.textContent = 'close navigation';
    }
}

// ========== AJAX PAGE NAVIGATION (no masonry) ==========
$(document).ready(function() {

    $(document).on('click', 'a', function(e) {
        var url = $(this).attr('href');
        var target = $(this).attr('target');

        if ($(this).closest('.pagination').length) return;
        if ($(this).attr('id') === 'next' || $(this).attr('id') === 'previous') return;
        if ($(this).find('img').length && $(this).closest('li.post.photo, li.post.photoset').length) return;

        var linkHost = new URL(url, window.location.origin).hostname;
        if (url && (url.startsWith('/') || linkHost === window.location.hostname) && target !== '_blank' && !url.startsWith('#')) {
            e.preventDefault();
            window.history.pushState(null, '', url);
            $('.main').fadeTo(200, 0.5);

            $.ajax({
                url: url,
                success: function(data) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(data, "text/html");

                    var newContent = $(doc).find('.main').html();
                    var newTitle = $(doc).find('title').text();
                    var newStyle = $(doc).find('#theme-styles').html();

                    $('.main').html(newContent).fadeTo(200, 1);
                    if (newStyle) $('#theme-styles').html(newStyle);
                    document.title = newTitle;
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    // Re-init infinite scroll for new page content
                    initInfiniteScroll();

                    if (typeof Tumblr !== 'undefined' && typeof Tumblr.LikeButton !== 'undefined') {
                        Tumblr.LikeButton.get_status_by_page(1);
                    }
                },
                error: function() {
                    window.location.href = url;
                }
            });
        }
    });

    // Popstate (back/forward buttons)
    $(window).on('popstate', function() {
        $('.main').fadeTo(200, 0.5);
        $.ajax({
            url: location.href,
            success: function(data) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, "text/html");
                $('.main').html($(doc).find('.main').html()).fadeTo(200, 1);
                var newStyle = $(doc).find('#theme-styles').html();
                if (newStyle) $('#theme-styles').html(newStyle);
                document.title = $(doc).find('title').text();
                initInfiniteScroll();
            }
        });
    });

    // ========== ONE COLUMN INFINITE SCROLL ==========
    function initInfiniteScroll() {
        var page = 1;
        var loading = false;
        var done = false;
        var container = document.getElementById('posts');
        if (!container) return;

        // Figure out current page from URL
        var match = window.location.pathname.match(/\/page\/(\d+)/);
        if (match) page = parseInt(match[1]);

        $(window).off('scroll.infiniteOneCol').on('scroll.infiniteOneCol', function() {
            if (loading || done) return;
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 800) {
                loading = true;
                page++;

                $.ajax({
                    url: '/page/' + page,
                    success: function(data) {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(data, 'text/html');
                        var newPosts = $(doc).find('#posts > li.post');

                        if (newPosts.length === 0) {
                            done = true;
                            $('.main').addClass('no-more-posts');
                            return;
                        }

                        newPosts.css({ opacity: 0 }).each(function() {
                            $('#posts').append(this);
                        });
                        newPosts.animate({ opacity: 1 }, 400);

                        if (typeof Tumblr !== 'undefined' && typeof Tumblr.LikeButton !== 'undefined') {
                            Tumblr.LikeButton.get_status_by_page(page);
                        }

                        loading = false;
                    },
                    error: function() {
                        done = true;
                        loading = false;
                    }
                });
            }
        });
    }

    // Start infinite scroll on first load
    initInfiniteScroll();
});

// ========== LIGHTBOX ==========
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

    $('#lightbox-close').on('click', function() { closeLightbox(); });

    $('#photo-lightbox').on('click', function(e) {
        if (e.target === this) closeLightbox();
    });

    $(document).on('keydown', function(e) {
        if ($('#photo-lightbox').css('display') === 'none') return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') $('#lightbox-next').click();
        if (e.key === 'ArrowLeft') $('#lightbox-prev').click();
    });
})();
