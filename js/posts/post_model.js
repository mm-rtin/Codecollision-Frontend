/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.posts.model - post model
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function($, _, Codecollision) {
    "use strict";

    // constants
    var AJAX_URL_APPEND = 'json/',

        // objects
        _getPost_jqXHR = null,

        // data
        _postDataCache = {};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * initialize -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var initialize = function() {


    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getPosts - get post data
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getPosts = function(url, onSuccess) {

        // abort previous request
        if(_getPost_jqXHR && _getPost_jqXHR.readyState != 4){
            _getPost_jqXHR.abort();
        }

        _getPostData(url, onSuccess);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * prefetchPostData -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var prefetchPostData = function(url, onSuccess) {

        _getPostData(url, onSuccess);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _getPostData - ajax call to get post JSON
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _getPostData = function(url, onSuccess) {

        url = Codecollision.util.utilities.cleanURL(url);

        // get cached post
        var cachedPost = _getCachedPost(url);

        // cached = fetch from memory
        if (cachedPost) {

            onSuccess(cachedPost);

        // not cached: new request
        } else {

            // make ajax request
            _getPost_jqXHR = $.ajax({
                url: url + AJAX_URL_APPEND,
                type: 'GET',
                dataType: 'json',
                success: function(data) {

                    // cache post
                    _cachePost(url, data);

                    onSuccess(data);
                },
                error: function(data) {

                }
            });
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _getCachedPost -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _getCachedPost = function(url) {

        // check if url exists in cache
        if (_.has(_postDataCache, url)) {
            return _postDataCache[url];
        }

        return null;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _cachePost -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _cachePost = function(url, data) {
        _postDataCache[url] = data;
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * public interface
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Codecollision.registerModule("Codecollision.posts.model", {

        // public methods
        initialize: initialize,
        getPosts: getPosts,
        prefetchPostData: prefetchPostData
    });

})(jQuery, _, Codecollision);