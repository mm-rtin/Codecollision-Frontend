/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.main
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Structure.init("Codecollision");

(function($, _, Codecollision) {
    "use strict";

    // constants
    var AJAX_LOAD_OFFSET = 300,
        NAV_FADE_OUT_AMOUNT = 0.5,
        NAV_FADE_DURATION = 150,
        PROJECT_FADE_OUT_AMOUNT = 0.5,
        PROJECT_FADE_DURATION = 250,

        PAGE_LOAD_DELAY = 500,

        // objects
        mainNavigationAnimationTimeout = null,
        projectAnimationTimeout = null,

        // jquery elements
        $mainNavigationItems = $('#main-navigation').find('li'),

        // public configuration
        config = {

            // constants
            BASE_URL: 'http://www.codecollision.com',
            DISPLAY_MODE: {'replace': 0, 'append': 1},

            // jquery elements
            $siteContainer: $('#container'),
            $contentContainer: $('#content'),
            $navigationContainer: $('#navigation'),
            $loadingStatus: $('#loading-status'),
            $pageNavigation: $('#pageNavigation'),

            // properties
            infiniteContentEnabled: true,
            maxPages: 0,
            nextPage: 0,
            previousPage: 0,
            currentCategory: ''
        };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * initialize -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var initialize = function () {

        // save page data attributes
        config.currentCategory = config.$siteContainer.attr('data-category');
        config.maxPages = parseInt(config.$siteContainer.attr('data-maxPages'), 10);
        config.nextPage = parseInt(config.$siteContainer.attr('data-nextpage'), 10);
        config.previousPage = parseInt(config.$siteContainer.attr('data-previousPage'), 10);

        // for each post entry check if images loaded
        config.$siteContainer.find('.post').each(function() {

            // post's images have loaded
            $(this).imagesLoaded(function($images, $proper, $broken) {

                // initialize orbit for post container
                _initializeOrbit($(this));
            });
        });

        // start inifinite content loader
        _initializeContentLoader();

        // init backstretch
        $.backstretch('http://dtli0f3gwjwjm.cloudfront.net/images/background.jpg', {speed: 1000, centeredY: false});

        // extend jQuery
        extendjQuery();

        // create event handlers
        _createEventHandlers();

        // intialize history
        Codecollision.util.history.initialize();

        // initialize posts
        Codecollision.posts.model.initialize();
        Codecollision.posts.view.initialize();

        // intialize prefetch
        Codecollision.util.prefetch.initialize();

        // hide pageNavigation
        config.$pageNavigation.css({visibility: 'hidden'});

        // fetch pages for current category
        fetchPages();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * fetchPages -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var fetchPages = function() {

        // fetch pages, returns jqXHR requests in array
        var pageRequests = Codecollision.util.prefetch.fetchPages();

        // when array of requests completes
        $.when.apply($, pageRequests).then(function() {

            var delayMultiplier = 1;

            // for each fetched page, load into site on delay
            _.each(pageRequests, function() {

                // load next page after short delay
                delayMultiplier++;
                _.delay(_loadNext, PAGE_LOAD_DELAY * delayMultiplier);
            });
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * extendjQuery -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var extendjQuery = function() {

        // get rootURL
        var rootUrl = window.History.getRootUrl();

        // extend jQuery with internal link custom selector
        $.extend($.expr[':'], {
            internal: function(obj, index, meta, stack){

                // Prepare
                var $this = $(obj),
                    url = $this.attr('href')||'',
                    isInternalLink;

                // Check link
                isInternalLink = url.substring(0, rootUrl.length) === rootUrl || url.indexOf(':') === -1;

                // Ignore or Keep
                return isInternalLink;
            }
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _createEventHandlers -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _createEventHandlers = function() {

        // document: page_change
        $(document).bind('page_change', function(event, url, mode) {
            _handlePageChange(url, mode);
        });

        // document: render complete
        $(document).bind('post_render_complete', function(e, posts) {

            console.info('render complete');

            var $posts = $(posts);

            // prefetch links in $posts container
            Codecollision.util.prefetch.prefetchLinks([$posts]);

            // fetch pages
            fetchPages();

            // when $posts images loaded > initialize orbit on $posts container
            $posts.imagesLoaded(function($images, $proper, $broken) {
                _initializeOrbit($posts);
            });
        });

        /* MAIN NAVIGATION EVENTS -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        // main navigation: mouseenter
        $mainNavigationItems.mouseenter(function(e) {

            var $activeNav = $(this);

            // stop timer on fadeIn
            window.clearTimeout( mainNavigationAnimationTimeout);

            // for each navigation item
            $mainNavigationItems.each(function() {

                // fade out other navigation items
                if ($(this).prop('id') !== $activeNav.prop('id')) {
                    $(this).stop().fadeTo(NAV_FADE_DURATION, NAV_FADE_OUT_AMOUNT);

                // fade in target navigation item
                } else {
                    $(this).stop().fadeTo(NAV_FADE_DURATION, 1);
                }
            });
        });

        // main navigation: mouseleave
        $mainNavigationItems.mouseleave(function(e) {

            // delay fade in of all navigation items
            mainNavigationAnimationTimeout = window.setTimeout(function() {
                $mainNavigationItems.stop().fadeTo(750, 1);
            }, 350);
        });


        /* PROJECT NAVIGATION EVENTS -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        // project: mouseenter
        config.$siteContainer.on('mouseenter', '#projects-page .project', function(e) {

            var $activeProject = $(this);

            // stop timer on fadeIn
            window.clearTimeout( projectAnimationTimeout);

            // for each project
            config.$siteContainer.find('#projects-page .project').each(function() {

                // fade out other project items
                if ($(this).prop('id') !== $activeProject.prop('id')) {
                    $(this).stop().fadeTo(PROJECT_FADE_DURATION, PROJECT_FADE_OUT_AMOUNT);

                // fade in target project
                } else {
                    $(this).stop().fadeTo(PROJECT_FADE_DURATION, 1);
                }
            });
        });

        // project: mouseleave
        config.$siteContainer.on('mouseleave', '#projects-page .project', function(e) {

            // delay fade in of all project items
            projectAnimationTimeout = window.setTimeout(function() {
               config.$siteContainer.find('#projects-page .project').stop().fadeTo(750, 1);
            }, 350);
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _handlePageChange -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _handlePageChange = function(url, mode) {

        // update currentCategory
        _updateCurrentCategory(url);

        // change post view page
        Codecollision.posts.view.changePage(url, mode);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _updateCurrentCategory - update category based on url
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _updateCurrentCategory = function(url) {

        url = Codecollision.util.utilities.cleanURL(url);

        var urlComponents = url.split('/');
        var categoryIndex = _.indexOf(urlComponents, 'category');

        // if site root: category is all
        if (url === '/') {
            config.currentCategory = 'all';

        // category url component found: update category
        } else if (categoryIndex !== -1) {
            config.currentCategory = urlComponents[categoryIndex + 1];

        // no category and not on site root
        } else {
            config.currentCategory = '';
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _initializeOrbit -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _initializeOrbit = function($container) {

        // initialize all image-box elements
        if (_.isUndefined($container)) {

            $('.image-box').each(function() {
                initializeOrbit(this);
            });

        // intialize image-box elements inside of $container
        } else {

           $container.find('.image-box').each(function() {
                initializeOrbit(this);
            });
        }

        function initializeOrbit(element) {
            var data = $.data(element, 'events');
            if (!data || !_.has(data, 'orbit')) {
                $(element).orbit();
            }
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _initializeContentLoader - loads next page when scrolled near end of page
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _initializeContentLoader = function() {

        // window, document: scroll event
        $(window, document).scroll(function() {

            // get container height, window height and scrollposition
            var containerHeight = config.$siteContainer.height();
            var windowHeight = $(window).height();
            var scrollTop = $(window).scrollTop();

            // detect if scrolled near end of document and is enabled
            if (scrollTop + AJAX_LOAD_OFFSET >= containerHeight - windowHeight && config.infiniteContentEnabled) {

                // load next set of posts
                _loadNext();
            }
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _loadNext - load next page entries based on category
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _loadNext = function() {

        // load if category has a next page
        if (config.nextPage !== 0) {

            // temporarily disable
            config.infiniteContentEnabled = false;

            // return if no category to load from
            if (!config.currentCategory) { return; }

            // load more entries for current category
            var url = '/category/' + config.currentCategory + '/' + config.nextPage + '/';

            // trigger page change in append mode
            $(document).trigger('page_change', [url, config.DISPLAY_MODE.append]);
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * public interface
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Codecollision.registerModule("Codecollision.main", {

        // public methods
        initialize: initialize,
        _updateCurrentCategory: _updateCurrentCategory,

        // configuration
        config: config
    });

})(jQuery, _, Codecollision);