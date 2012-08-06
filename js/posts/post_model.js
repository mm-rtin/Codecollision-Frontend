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
        _getPost_jqXHR: null,

        // data
        _postDataCache: {},

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * initialize -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        initialize: function() {
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * getPosts - get post data
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        getPosts: function(url, onSuccess) {

            // abort previous request
            if(this._getPost_jqXHR && this._getPost_jqXHR.readyState != 4){
                this._getPost_jqXHR.abort();
            }

            this._getPostData(url, onSuccess);
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * prefetchPostData -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        prefetchPostData: function(url, onSuccess) {

            this._getPostData(url, onSuccess);
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _getPostData - ajax call to get post JSON
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _getPostData: function(url, onSuccess) {

            var _this = this;

            // make sure url ends in '/'
            if (url.charAt(url.length - 1) !== '/') {
                url += '/';
            }

            // get cached post
            var cachedPost = this._getCachedPost(url);

            // cached: fetch from memory
            if (cachedPost) {
                onSuccess(cachedPost);

            // not cached: new request
            } else {

                // make ajax request
                this._getPost_jqXHR = $.ajax({
                    url: url + this.AJAX_URL_APPEND,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {

                        // cache post
                        _this._cachePost(url, data);

                        onSuccess(data);
                    },
                    error: function(data) {
                    }
                });
            }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _getCachedPost -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _getCachedPost: function(url) {

            // check if url exists in cache
            if (_.has(this._postDataCache, url)) {
                return this._postDataCache[url];
            }

            return null;
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * _cachePost -
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        _cachePost: function(url, data) {
            this._postDataCache[url] = data;
        },
    });

})(jQuery, _, Codecollision);