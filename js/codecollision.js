/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.main
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Structure.init("Codecollision");

(function($, _, Codecollision, iScroll, yepnope) {
    "use strict";

    var isMobile = function(a,b) {
        if (/ipad|android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
            return true;
        } else {
            return false;
        }
    };

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

            // test for mobile device and load mobile specific css and javascript
            yepnope({
                test: isMobile(navigator.userAgent||navigator.vendor||window.opera),
                yep: ['http://media.codecollision.com/css/mobile.css', 'http://media.codecollision.com/js/mobile.js'],
                complete: function () {

                }
            });

            // extend jQuery
            this.extendjQuery();

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

            // prefetch
            Codecollision.util.prefetch.initialize();
        },


        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * extendjQuery -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        extendjQuery: function() {

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