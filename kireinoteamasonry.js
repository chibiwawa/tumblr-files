if (window.location.href.indexOf('customize') > -1) {
    $('iframe[src*="tumblr.com/video"]').remove();
    $('.tumblr_video_container').remove();
    $('video').remove();
    $('iframe[src*="youtube.com"]').remove();
    $('iframe[src*="youtu.be"]').remove();
}

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

$(document).on('click', 'a[href*="tumblr.com"]', function(e) {
    var url = this.href;
    if (url.includes(window.location.hostname) || this.target === '_blank') return;
    e.preventDefault();
    var exit = document.getElementById('exit-screen');
    exit.style.display = 'flex';
    requestAnimationFrame(function() { exit.classList.add('visible'); });
    setTimeout(function() { window.location.href = url; }, 500);
});

$(window).on('scroll', function() {
    if ($(this).scrollTop() > 300) $('.scroll-top').addClass('visible');
    else $('.scroll-top').removeClass('visible');
});

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

$(document).ready(function() {
    var $container = $('#posts');

    if (typeof $.fn.masonry !== 'undefined' && $container.length && $container.find('li.post').length > 0) {
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
    }

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
                    
                    if (newStyle) {
                        $('#theme-styles').html(newStyle);
                    }
                    document.title = newTitle;
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    var $grid = $('#posts');

                    if (typeof $.fn.masonry !== 'undefined' && $grid.length && $grid.find('li.post').length > 0) {
                        var $fp = $grid.find('li.post').first();
                        var pw = $fp.outerWidth();
                        var cw = $grid.width();
                        var isOneCol = (pw / cw) > 0.6;

                        if (!isOneCol) {
                            $grid.masonry({ itemSelector: 'li.post' });

                            var images = $grid.find('img');
                            var loaded = 0;
                            var total = images.length;
                            var layoutDone = false;

                            function relayout() {
                                if (layoutDone) return;
                                layoutDone = true;
                                $grid.masonry('layout');
                            }

                            if (total === 0) {
                                relayout();
                            } else {
                                images.each(function() {
                                    var img = this;
                                    if (img.complete && img.naturalHeight > 0) {
                                        loaded++;
                                        if (loaded >= total) relayout();
                                    } else {
                                        img.src = img.src;
                                        $(img).on('load error', function() {
                                            loaded++;
                                            if (loaded >= total) relayout();
                                        });
                                    }
                                });

                                setTimeout(function() {
                                    relayout();
                                }, 3000);
                            }
                        }
                    }

                    if (typeof $.fn.infinitescroll !== 'undefined' && $grid.length && $('.pagination #next').length) {
                        var hasMasonry = typeof $.fn.masonry !== 'undefined' && $grid.data('masonry');

                        $grid.infinitescroll({
                            navSelector:  '.pagination',
                            nextSelector: '.pagination #next',
                            itemSelector: 'li.post',
                            bufferPx: 600,
                            loading: { img: '', msgText: '' }
                        }, function(newElements) {
                            var $n = $(newElements).css({ opacity: 0 });
                            var imgs = $n.find('img'), ld = 0, tot = imgs.length;
                            function done() {
                                $n.animate({opacity:1},400);
                                if (hasMasonry) $grid.masonry('appended', $n);
                            }
                            if (!tot) done();
                            else imgs.each(function(){
                                if(this.complete){ld++;if(ld>=tot)done();}
                                else $(this).on('load error',function(){ld++;if(ld>=tot)done();});
                            });
                        });
                    }
                    
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

                var $grid = $('#posts');

                if (typeof $.fn.masonry !== 'undefined' && $grid.length && $grid.find('li.post').length > 0) {
                    var $fp = $grid.find('li.post').first();
                    var pw = $fp.outerWidth();
                    var cw = $grid.width();
                    var isOneCol = (pw / cw) > 0.6;

                    if (!isOneCol) {
                        $grid.masonry({ itemSelector: 'li.post' });

                        var images = $grid.find('img');
                        var loaded = 0;
                        var total = images.length;
                        var layoutDone = false;

                        function relayout2() {
                            if (layoutDone) return;
                            layoutDone = true;
                            $grid.masonry('layout');
                        }

                        if (total === 0) {
                            relayout2();
                        } else {
                            images.each(function() {
                                var img = this;
                                if (img.complete && img.naturalHeight > 0) {
                                    loaded++;
                                    if (loaded >= total) relayout2();
                                } else {
                                    img.src = img.src;
                                    $(img).on('load error', function() {
                                        loaded++;
                                        if (loaded >= total) relayout2();
                                    });
                                }
                            });

                            setTimeout(function() {
                                relayout2();
                            }, 3000);
                        }
                    }
                }

                if (typeof $.fn.infinitescroll !== 'undefined' && $grid.length && $('.pagination #next').length) {
                    var hasMasonry = typeof $.fn.masonry !== 'undefined' && $grid.data('masonry');

                    $grid.infinitescroll({
                        navSelector:  '.pagination',
                        nextSelector: '.pagination #next',
                        itemSelector: 'li.post',
                        bufferPx: 600,
                        loading: { img: '', msgText: '' }
                    }, function(newElements) {
                        var $n = $(newElements).css({ opacity: 0 });
                        var imgs = $n.find('img'), ld = 0, tot = imgs.length;
                        function done2() {
                            $n.animate({opacity:1},400);
                            if (hasMasonry) $grid.masonry('appended', $n);
                        }
                        if (!tot) done2();
                        else imgs.each(function(){
                            if(this.complete){ld++;if(ld>=tot)done2();}
                            else $(this).on('load error',function(){ld++;if(ld>=tot)done2();});
                        });
                    });
                }
            }
        });
    });
});

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
