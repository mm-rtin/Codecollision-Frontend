/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.posts.view - post view
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function($, _, Codecollision) {
    "use strict";

    // constants

    // properties

    // jquery elements
    var $contentContainer = Codecollision.main.config.$contentContainer,
        $loadingStatus = Codecollision.main.config.$loadingStatus,

        // objects
        loadingStatusTimeout = null,
		postsTemplate = _.template($('#posts-template').html());


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * initialize -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var initialize = function () {

        // create event handlers
        _createEventHandlers();
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * changePage -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var changePage = function(url, mode) {

        // get posts
        _getPosts(url, mode);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _createEventHandlers -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _createEventHandlers = function() {

    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _getPosts - get post data from model
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _getPosts = function(url, mode) {

        // show status
        _showStatus(mode);

        // get posts
        Codecollision.posts.model.getPosts(url, function(data) {
            _getPosts_result(data, mode);
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _getPosts_result - result from getPosts
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _getPosts_result = function(data, mode) {

        // render posts
        _displayPosts(data, mode);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _displayPosts - render posts to content container
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _displayPosts = function(posts, mode) {

        console.info('display post');
        var addedPosts = null;

        // hide loading status
        _hideStatus();

        // check if posts available
        if (posts.post_list.length !== 0) {

            // replace posts in contentContainer
            if (mode === Codecollision.main.config.DISPLAY_MODE.replace) {

                // replace container html
                addedPosts = $contentContainer.html(postsTemplate(posts));

                // scroll to top
                $(document).scrollTop(0);

            // append posts in contentContainer
            } else if (mode === Codecollision.main.config.DISPLAY_MODE.append) {

                // verify that selectName matches currentCategory
                if (posts.selectName === Codecollision.main.config.currentCategory) {

                    // append html to contentContainer
                    addedPosts = $(postsTemplate(posts)).appendTo($contentContainer);
                }
            }

            // update maxPages site config
            Codecollision.main.config.maxPages = posts.max_pages;
            Codecollision.main.config.nextPage = posts.next_page;
            Codecollision.main.config.previousPage = posts.previous_page;

            // re-enable infinite scroll if current display has a next page
            if (posts.next_page !== 0) {
                Codecollision.main.config.infiniteContentEnabled = true;
            }
        }

        // trigger render complete event
        $(document).trigger('post_render_complete', addedPosts);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _showStatus - show post loading indicator
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _showStatus = function(mode) {

        if (mode === Codecollision.main.config.DISPLAY_MODE.replace) {

            // delay by 100ms
            loadingStatusTimeout = window.setTimeout(function() {

                // clear content
                $contentContainer.empty();

                // show loading status
                $loadingStatus.fadeIn(function() {

                    // when fadeIn completes > start animation
                   $loadingStatus.addClass('opacity-loop');
                });

                loadingStatusTimeout = null;
            }, 100);
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _hideStatus - hide post loading indicator
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _hideStatus = function() {

        if (typeof loadingStatusTimeout == "number") {
            window.clearTimeout(loadingStatusTimeout);
            loadingStatusTimeout = null;
        } else {
            // hide loading status
            $loadingStatus.hide();
            // stop animation
            $loadingStatus.removeClass('opacity-loop');
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * public interface
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Codecollision.registerModule("Codecollision.posts.view", {

        // public methods
        initialize: initialize,
        changePage: changePage

    });

})(jQuery, _, Codecollision);
