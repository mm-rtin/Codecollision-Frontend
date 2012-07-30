/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.main
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Structure.init("Codecollision");

(function($, _, Codecollision) {
    "use strict";

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * Codecollision.main - entry method
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Codecollision.registerModule("Codecollision.main", {

        // constants
        BASE_URL: 'http://www.codecollision.com',
        AJAX_LOAD_OFFSET: 300,

        // public properties
        infiniteScrollEnabled: true,
        currentPage: 1,
        currentCategory: null,

        // objects

        // jquery elements
        $siteContainer: $('#container'),

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * initialize -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        initialize: function () {

            // update currentCategory
            this.updateCurrentCategory(window.location.pathname);

            // create event handlers
            this.createEventHandlers();

            // intialize history
            Codecollision.util.history.initialize();

            // intialize inifinite scroll
            this._initializeInfiniteScroll();

            // initialize modules
            Codecollision.posts.model.initialize();
            Codecollision.posts.view.initialize();
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * createEventHandlers -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        createEventHandlers: function() {

            var _this = this;

            // window: page_change
            $(document).bind('page_change', function(event, url, mode) {
                _this._handlePageChange(url, mode);
            });
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _handlePageChange -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _handlePageChange: function(url, mode) {

            // strip BASE_URL from url
            url = url.replace(this.BASE_URL, '');

            // update currentCategory
            this.updateCurrentCategory(url);

            // change post view page
            Codecollision.posts.view.changePage(url, mode);
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * updateCurrentCategory - update category based on url
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        updateCurrentCategory: function(url) {

            var urlComponents = url.split('/');
            var categoryIndex = _.indexOf(urlComponents, 'category');

            // if site root: category is all
            if (url === '/') {
                this.currentCategory = 'all';

            // category url component found: update category
            } else if (categoryIndex !== -1) {
                this.currentCategory = urlComponents[categoryIndex + 1];

            // no category and not on site root
            } else {
                this.currentCategory = null;
            }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _initializeInfiniteScroll -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _initializeInfiniteScroll: function() {

            var _this = this;

            var containerHeight = _this.$siteContainer.height();
            var windowHeight = $(window).height();

            // window, document: scroll event
            $(window, document).scroll(function() {

                // get container height, window height and scrollposition
                var containerHeight = _this.$siteContainer.height();
                var windowHeight = $(window).height();
                var scrollTop = $(window).scrollTop();

                // detect if scrolled near end of document
                if (scrollTop + _this.AJAX_LOAD_OFFSET >= containerHeight - windowHeight && _this.infiniteScrollEnabled) {

                    // load next set
                    _this._loadNext();
                }
            });
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _loadNext - load more entries based on category
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _loadNext: function() {

            // temporarily disable
            this.infiniteScrollEnabled = false;

            // return if no category to load from
            if (this.currentCategory === null) { return; }

            // load more entries for current category
            this.currentPage += 1;
            var url = '/category/' + this.currentCategory + '/' + this.currentPage + '/';

            // trigger page change
            $(document).trigger('page_change', [url, 'append']);
        }


    });

})(jQuery, _, Codecollision);