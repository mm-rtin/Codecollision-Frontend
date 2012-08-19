/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.posts.model - post model
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function($, _, Codecollision) {
    "use strict";

    // constants
    var AJAX_URL_APPEND = 'json/',

        // objects
        ajaxRequests = [],

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

        // live page request - abort prefetch requests
        _.each(ajaxRequests, function(jqXHR) {

            if(jqXHR && jqXHR.readyState != 4){
                jqXHR.abort();
            }
        });

        _getPostData(url, onSuccess);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * prefetchPostData -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var prefetchPostData = function(url, onSuccess) {

        return _getPostData(url, onSuccess);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _getPostData - ajax call to get post JSON
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _getPostData = function(url, onSuccess) {

        var jqXHR = null;

        url = Codecollision.util.utilities.cleanURL(url);

        // get cached post
        var cachedPost = _getCachedPost(url);

        // cached = fetch from memory
        if (cachedPost) {

            onSuccess(cachedPost);

        // not cached: new request
        } else {

            // make ajax request
            jqXHR = $.ajax({
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

            // store ajax request
            ajaxRequests.push(jqXHR);
        }

        return jqXHR;
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