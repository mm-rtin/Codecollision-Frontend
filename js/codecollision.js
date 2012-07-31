/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.main
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Structure.init("Codecollision");

(function($, _, Codecollision, iScroll, yepnope) {
    "use strict";

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * Codecollision.main - entry method
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Codecollision.registerModule("Codecollision.main", {

        // constants
        BASE_URL: 'http://www.codecollision.com',
        AJAX_LOAD_OFFSET: 300,
        NAV_FADE_OUT_AMOUNT: 0.5,
        NAV_FADE_DURATION: 150,
        PROJECT_FADE_OUT_AMOUNT: 0.5,
        PROJECT_FADE_DURATION: 250,

        // public properties
        infiniteScrollEnabled: true,
        currentPage: 1,
        currentCategory: null,

        // objects
        mainNavigationAnimationTimeout: null,
        projectAnimationTimeout: null,

        // jquery elements
        $siteContainer: $('#container'),
        $mainNavigationItems: $('#main-navigation').find('li'),

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * initialize -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        initialize: function () {

            // test for ios device and load ios specific css
            yepnope({
                test: (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)),
                yep: ['http://media.codecollision.com/css/ios.css', 'http://media.codecollision.com/js/ios.js'],
                complete: function () {
                    console.info('yepnope done');
                }
            });

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


            /* MAIN NAVIGATION EVENTS -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            // main navigation: mouseenter
            this.$mainNavigationItems.mouseenter(function(e) {

                var $activeNav = $(this);

                // stop timer on fadeIn
                window.clearTimeout( _this.mainNavigationAnimationTimeout);

                // for each navigation item
                _this.$mainNavigationItems.each(function() {

                    // fade out other navigation items
                    if ($(this).prop('id') !== $activeNav.prop('id')) {
                        $(this).stop().fadeTo(_this.NAV_FADE_DURATION, _this.NAV_FADE_OUT_AMOUNT);

                    // fade in target navigation item
                    } else {
                        $(this).stop().fadeTo(_this.NAV_FADE_DURATION, 1);
                    }
                });
            });

            // main navigation: mouseleave
            this.$mainNavigationItems.mouseleave(function(e) {

                // delay fade in of all navigation items
                _this.mainNavigationAnimationTimeout = window.setTimeout(function() {
                    _this.$mainNavigationItems.stop().fadeTo(750, 1);
                }, 350);
            });


            /* PROJECT NAVIGATION EVENTS -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            // project: mouseenter
            this.$siteContainer.on('mouseenter', '#projects-page .project', function(e) {

                var $activeProject = $(this);

                // stop timer on fadeIn
                window.clearTimeout( _this.projectAnimationTimeout);

                // for each project
                _this.$siteContainer.find('#projects-page .project').each(function() {

                    // fade out other project items
                    if ($(this).prop('id') !== $activeProject.prop('id')) {
                        $(this).stop().fadeTo(_this.PROJECT_FADE_DURATION, _this.PROJECT_FADE_OUT_AMOUNT);

                    // fade in target project
                    } else {
                        $(this).stop().fadeTo(_this.PROJECT_FADE_DURATION, 1);
                    }
                });
            });

            // project: mouseleave
            this.$siteContainer.on('mouseleave', '#projects-page .project', function(e) {

                // delay fade in of all project items
                _this.projectAnimationTimeout = window.setTimeout(function() {
                   _this.$siteContainer.find('#projects-page .project').stop().fadeTo(750, 1);
                }, 350);
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

})(jQuery, _, Codecollision, iScroll, yepnope);