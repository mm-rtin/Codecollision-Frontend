/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.posts.view - post view
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function($, _, Codecollision) {
    "use strict";

	Codecollision.registerModule("Codecollision.posts.view", {

        // constants

        // public properties

        // jquery elements
        $contentContainer: $('#content'),
        $loadingStatus: $('#loading-status'),

        // objects
        loadingStatusTimeout: null,
		postsTemplate: _.template($('#posts-template').html()),

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * initialize -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		initialize: function () {

            // create event handlers
            this.createEventHandlers();
		},

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * createEventHandlers -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        createEventHandlers: function() {

            var _this = this;

        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * changePage -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        changePage: function(url, mode) {

            // get posts
            this._getPosts(url, mode);
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _getPosts - get post data from model
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _getPosts: function(url, mode) {

            var _this = this;

            // show status
            this.showStatus(mode);

            // get posts
            Codecollision.posts.model.getPosts(url, function(data) {
                _this._getPosts_result(data, mode);
            });
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _getPosts_result - result from getPosts
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _getPosts_result: function(data, mode) {

            // render posts
            this._displayPosts(data, mode);
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _displayPosts - render posts to content container
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _displayPosts: function(posts, mode) {

            var addedPosts = null;

            // hide loading status
            this.hideStatus();

            // check if posts available
            if (posts.post_list.length !== 0) {

                // replace posts in contentContainer
                if (mode === 'replace') {

                    // replace container html
                    addedPosts = this.$contentContainer.html(this.postsTemplate(posts));

                    // scroll to top
                    $(document).scrollTop(0);

                    // reset current page
                    Codecollision.main.currentPage = 1;

                // append posts in contentContainer
                } else if (mode === 'append') {

                    // verify that selectName matches currentCategory
                    if (posts.selectName === Codecollision.main.currentCategory) {

                        // append html to contentContainer
                        addedPosts = $(this.postsTemplate(posts)).appendTo(this.$contentContainer);
                    }
                }

                // re-enable infinite scroll if more than 1 page
                if (posts.max_pages > 1) {
                    Codecollision.main.infiniteScrollEnabled = true;
                }
            }

            // trigger render complete event
            $(document).trigger('post_render_complete', addedPosts);
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * showStatus -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        showStatus: function(mode) {

            var _this = this;

            if (mode === 'replace') {

                // delay by 100ms
                this.loadingStatusTimeout = window.setTimeout(function() {

                    // clear content
                    _this.$contentContainer.empty();

                    // show loading status
                    _this.$loadingStatus.fadeIn(function() {

                        // when fadeIn completes > start animation
                       _this.$loadingStatus.addClass('opacity-loop');
                    });

                    _this.loadingStatusTimeout = null;
                }, 100);
            }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * hideStatus -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        hideStatus: function() {

            if (typeof this.loadingStatusTimeout == "number") {
                window.clearTimeout(this.loadingStatusTimeout);
                this.loadingStatusTimeout = null;
            } else {
                // hide loading status
                this.$loadingStatus.hide();
                // stop animation
                this.$loadingStatus.removeClass('opacity-loop');
            }
        }
	});

})(jQuery, _, Codecollision);
