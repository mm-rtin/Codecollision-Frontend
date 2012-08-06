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
    * Codecollision.main - entry method
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Codecollision.registerModule("Codecollision.util.history", {

        // constants

        // public properties

        // objects

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * initialize -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        initialize: function () {

            // intialize history.js
            this.initializeHistory();
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * initializeHistory -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        initializeHistory: function() {

            var _this = this;

            // init History.js
            History = window.History;
            if ( !History.enabled ) {
                return false;
            }

            // ajaxify links
            this._ajaxifyLinks(Codecollision.main.$siteContainer);

            // window: statechange event
            History.Adapter.bind(window,'statechange', function(){

                var State = History.getState();

                // load ajax'ed page
                _this._loadAjaxPage(State);
            });
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _loadAjaxPage -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _loadAjaxPage: function(State) {

            // trigger page_change event
            $(document).trigger('page_change', [State.url, 'replace']);
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _ajaxifyLinks -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _ajaxifyLinks: function($container) {

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
        },
    });

})(jQuery, _, Codecollision);