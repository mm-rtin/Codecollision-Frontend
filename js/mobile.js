(function($, iScroll) {

	// initialize iScroll
    var iScroller = new iScroll('container', { hScrollbar: false, vScrollbar: true });

    // disable touchmove
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

    // window: page_change
    $(document).bind('post_render_complete', function(event) {
        setTimeout(function () {
            console.info('refresh');
            iScroller.refresh();
        }, 0);
    });

})(jQuery, iScroll);