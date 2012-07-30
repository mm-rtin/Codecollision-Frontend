/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.posts.model - post model
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function($, _, Codecollision) {
    "use strict";


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * Codecollision.posts.model -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Codecollision.registerModule("Codecollision.posts.model", {

        // constants
        AJAX_URL_APPEND: 'json/',

        // module references


        // public properties


        // objects


        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * initialize -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        initialize: function() {
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * getPosts - get post data
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        getPosts: function(url, onSuccess) {

            this._getPostData(url, onSuccess);
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _getPostData - ajax call to get post JSON
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _getPostData: function(url, onSuccess) {

            // make sure url ends in '/'
            if (url.charAt(url.length - 1) !== '/') {
                url += '/';
            }

            $.ajax({
                url: url + this.AJAX_URL_APPEND,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    onSuccess(data);
                },
                error: function(data) {
                }
            });
        }
    });

})(jQuery, _, Codecollision);