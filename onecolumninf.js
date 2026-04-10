 (function() {
            var page = 1;
            var totalPages = {TotalPages};
            var loading = false;
            var container = document.getElementById('posts');
            
            // Don't run on permalink pages
            if (!container) return;
            
            window.addEventListener('scroll', function() {
                if (loading) return;
                if (page >= totalPages) {
                    // Hide the "loading more posts" indicator
                    var main = document.querySelector('.main');
                    if (main) main.classList.add('no-more-posts');
                    return;
                }
                
                // Check if user scrolled near the bottom
                var scrollBottom = window.innerHeight + window.scrollY;
                var docHeight = document.documentElement.scrollHeight;
                
                if (scrollBottom >= docHeight - 800) {
                    loading = true;
                    page++;
                    
                    fetch('/page/' + page)
                        .then(function(res) { return res.text(); })
                        .then(function(html) {
                            var parser = new DOMParser();
                            var doc = parser.parseFromString(html, 'text/html');
                            var newPosts = doc.querySelectorAll('#posts > li.post');
                            
                            // Find the pagination div to insert before
                            var pagination = container.querySelector('.pagination') 
                                || container.lastElementChild;
                            
                            newPosts.forEach(function(post) {
                                // Insert each new post
                                container.insertBefore(
                                    document.importNode(post, true),
                                    pagination
                                );
                            });
                            
                            // Re-bind any lightbox or tag toggles
                            if (typeof bindLightbox === 'function') {
                                bindLightbox();
                            }
                            
                            loading = false;
                        })
                        .catch(function() {
                            loading = false;
                        });
                }
            });
        })();
