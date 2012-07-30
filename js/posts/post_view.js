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

        // objects
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

            // check if posts available
            if (posts.post_list.length !== 0) {

                // replace posts in contentContainer
                if (mode === 'replace') {
                    this.$contentContainer.html(this.postsTemplate(posts));

                    // scroll to top
                    $(document).scrollTop(0);

                    // reset current page
                    Codecollision.main.currentPage = 1;

                // append posts in contentContainer
                } else if (mode === 'append') {

                    // verify that selectName matches currentCategory
                    if (posts.selectName === Codecollision.main.currentCategory) {
                        this.$contentContainer.append(this.postsTemplate(posts));
                    }
                }

                // re-enable infinite scroll if more than 1 page
                if (posts.max_pages > 1) {
                    Codecollision.main.infiniteScrollEnabled = true;
                }
            }
        },
	});

})(jQuery, _, Codecollision);
