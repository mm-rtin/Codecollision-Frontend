/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.util.history
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function($, _, Codecollision) {
    "use strict";

    // private properties
    var rootUrl = null;

    // objects
    var History = null;

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * initialize -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var initialize = function () {

        // intialize history.js
        _initializeHistory();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _initializeHistory -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _initializeHistory = function() {

        // init History.js
        History = window.History;
        if ( !History.enabled ) {
            return false;
        }

        // ajaxify links
        _ajaxifyLinks(Codecollision.main.config.$siteContainer);

        // window: statechange event
        History.Adapter.bind(window,'statechange', function(){

            var State = History.getState();

            // load ajax'ed page
            _loadAjaxPage(State);
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _loadAjaxPage -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _loadAjaxPage = function(State) {

        // trigger page_change event in replace mode
        $(document).trigger('page_change', [State.url, Codecollision.main.config.DISPLAY_MODE.replace]);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _ajaxifyLinks -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _ajaxifyLinks = function($container) {

        // ajaxify internal links
        $container.on('click', 'a:internal:not(.no-ajax)', function(event) {

            var $this = $(this),
                url = $this.attr('href'),
                title = $this.attr('title')||null;

            // Continue as normal for cmd clicks etc
            if (event.which == 2 || event.metaKey) { return true; }

            // Ajaxify this link
            History.pushState(null,title,url);
            event.preventDefault();
            return false;
        });
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * public interface
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Codecollision.registerModule("Codecollision.util.history", {

        // public methods
        initialize: initialize
    });

})(jQuery, _, Codecollision);