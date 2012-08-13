/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Codecollision.util.utilities
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function($, _, Codecollision) {
    "use strict";

    // private properties

    // objects

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * formatPostDate -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var formatPostDate = function(dateString) {

        var month_names = [];
        month_names[month_names.length] = "January";
        month_names[month_names.length] = "February";
        month_names[month_names.length] = "March";
        month_names[month_names.length] = "April";
        month_names[month_names.length] = "May";
        month_names[month_names.length] = "June";
        month_names[month_names.length] = "July";
        month_names[month_names.length] = "August";
        month_names[month_names.length] = "September";
        month_names[month_names.length] = "October";
        month_names[month_names.length] = "November";
        month_names[month_names.length] = "December";

        var dateSplit = dateString.split('-');
        var daySplit = dateSplit[2].split(' ');

        var date = new Date (dateSplit[0], dateSplit[1] - 1, daySplit[0]);

        return (month_names[date.getMonth()] + " " + date.getDate() + "." + date.getFullYear());
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * cleanURL -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var cleanURL = function(url) {

        // make sure url ends in '/'
        if (url.charAt(url.length - 1) !== '/') {
            url += '/';
        }

        // strip BASE_URL from url
        url = url.replace(Codecollision.main.config.BASE_URL, '');

        return url;
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * public interface
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Codecollision.registerModule("Codecollision.util.utilities", {

        formatPostDate: formatPostDate,
        cleanURL: cleanURL

    });

})(jQuery, _, Codecollision);