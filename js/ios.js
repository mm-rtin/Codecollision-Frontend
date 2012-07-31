(function($, iScroll) {

	// initialize iScroll
    var iScroller = new iScroll('container', { hScrollbar: false, vScrollbar: false });

    // disable touchmove
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

    console.info('iScroll oaded');

})(jQuery, iScroll);