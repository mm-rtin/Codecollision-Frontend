/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.util.prefetch
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function($, _, Codecollision) {
    "use strict";


    // objects
    var _prefetchedLinks = {};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * initialize -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var initialize = function () {

        prefetchPosts(Codecollision.main.config.$siteContainer);
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * prefetchPosts -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var prefetchPosts = function($container) {

        // prefetch links
        _processInternalLinks($container);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * prefetchPages -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var prefetchPages = function() {

        var currentCategory = Codecollision.main.config.currentCategory;

        if (!currentCategory) { return; }

        var maxPages = Codecollision.main.config.maxPages,
            nextPage = Codecollision.main.config.nextPage,
            previousPage = Codecollision.main.config.previousPage;

        // prefetch pages from 1 to previousPage
        if (previousPage !== 0) {
            for (var i = 1, prevLen = previousPage; i <= prevLen; i++) {
                _prefetchLink('/category/' + currentCategory + '/' + i);
            }
        }

        // prefetch pages from nextPage to maxPages
        if (nextPage !== 0) {
            for (var j = nextPage, nextLen = maxPages; j <= nextLen; j++) {
                _prefetchLink('/category/' + currentCategory + '/' + j);
            }
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _processInternalLinks -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _processInternalLinks = function($container) {

        // get all internal links inside $container
        $container.find('a:internal:not(.no-ajax)').each(function() {

            // for each internal link > start prefetch
            _prefetchLink($(this).prop('href'));
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _prefetchLink -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _prefetchLink = function(url) {

        url = Codecollision.util.utilities.cleanURL(url);

        if (!_.has(_prefetchedLinks, url)) {

            _prefetchedLinks[url] = true;

            // prefetch url
            Codecollision.posts.model.prefetchPostData(url, function(data) {

                // prefetch complete
            });
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * public interface
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Codecollision.registerModule("Codecollision.util.prefetch", {

        // public methods
        initialize: initialize,
        prefetchPosts: prefetchPosts,
        prefetchPages: prefetchPages
    });

})(jQuery, _, Codecollision);