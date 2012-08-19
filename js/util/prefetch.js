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

        // prefetch links in main navigation and content
        var containers = [Codecollision.main.config.$navigationContainer, Codecollision.main.config.$contentContainer];
        prefetchLinks(containers);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * prefetchLinks -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var prefetchLinks = function(containers) {

        // prefetch links
        _processInternalLinks(containers);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * fetchPages -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var fetchPages = function() {

        // all page requests
        var ajaxRequests = [];

        var currentCategory = Codecollision.main.config.currentCategory;

        if (!currentCategory) { return; }

        var maxPages = Codecollision.main.config.maxPages,
            nextPage = Codecollision.main.config.nextPage,
            previousPage = Codecollision.main.config.previousPage;

        // prefetch pages from 1 to previousPage
        if (previousPage !== 0) {
            for (var i = 1, prevLen = previousPage; i <= prevLen; i++) {
                ajaxRequests.push(_prefetchLink('/category/' + currentCategory + '/' + i));
            }
        }

        // prefetch pages from nextPage to maxPages
        if (nextPage !== 0) {
            for (var j = nextPage, nextLen = maxPages; j <= nextLen; j++) {
                ajaxRequests.push(_prefetchLink('/category/' + currentCategory + '/' + j));
            }
        }

        return ajaxRequests;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _processInternalLinks -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _processInternalLinks = function(containers) {

        _.each(containers, function($container) {

            // get all internal links inside $container
            $container.find('a:internal:not(.no-ajax)').each(function() {

                // for each internal link > start prefetch
                _prefetchLink($(this).prop('href'));
            });
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _prefetchLink -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _prefetchLink = function(url) {

        var jqXHR = null;

        url = Codecollision.util.utilities.cleanURL(url);

        if (!_.has(_prefetchedLinks, url)) {

            _prefetchedLinks[url] = true;

            // prefetch url
            jqXHR = Codecollision.posts.model.prefetchPostData(url, function(data) {

                // prefetch complete
            });
        }

        return jqXHR;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * public interface
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Codecollision.registerModule("Codecollision.util.prefetch", {

        // public methods
        initialize: initialize,
        prefetchLinks: prefetchLinks,
        fetchPages: fetchPages
    });

})(jQuery, _, Codecollision);