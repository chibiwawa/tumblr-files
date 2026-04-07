$(document).ready(function() {
    var $container = $('#posts');

    if ($container.length && $container.find('li.post').length > 0) {
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
