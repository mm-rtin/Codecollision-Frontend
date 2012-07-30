/* formatDate
---------------------------------------- */
function formatDate(dateString) {

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

	date = new Date (dateSplit[0], dateSplit[1] - 1, daySplit[0]);
	return (month_names[date.getMonth()] + " " + date.getDate() + "." + date.getFullYear());
}

/* GLOBAL NAMESPACE
---------------------------------------- */
var GLOBAL = {
	domain: "http://www.codecollision.com",
	ignoreLinkEvent: false,
	isIE: false,
	IEVersion: 0
};

/* POSTS NAMESPACE
---------------------------------------- */
var POSTS = {
	postData: [],
	container: "#main",
	lastURL: "/",
	contentType: "post",
	pageNumber: 1,
	maxPages: 0,
	nextPage: 0,
	previousPage: 0,

	// GET SINGLE POST
	getPost: function(postName) {
		// Load Data
		var _posts = this;
		var _comments = COMMENTS;
		var data = {"postName":postName};
		$.getJSON("/json/getposts/", data,
			function(data) {
				// REMOVE OLD ARTICLES
				$('#main div.post').remove();
				// REMOVE OLD COMMENTS
				$('#main #commentsContainer').remove();

				// update maxPages, nextPage, previousPage
				POSTS.maxPages = data.max_pages;
				POSTS.nextPage = data.next_page;
				POSTS.previousPage = data.previous_page;

				// hide page navigation
				POSTS.hidePageNavigation();

				// postID
				var postID = 0;

				$.each(data.post_list, function() {

					// format date
					this.fields.post_date =  formatDate(this.fields.post_date);
					// set postID
					postID = this.pk;
					// display post
					_posts.displayPost(this);

					// get comments - only for single blog posts
					if (this.fields.post_type == 'post') {
						_comments.getComments(postID);
					}
				});

				// trigger link events
				$('.source, .view').trigger('mouseout');
			}
		);
	},

	// GET POSTS
	getPosts: function(category) {
		var _posts = this;
		var data = {"pageNumber":POSTS.pageNumber};
		if (category != "all") {
			data["category"] = category;
		}

		$.getJSON('/json/getposts/', data,
			function(data) {
				// REMOVE OLD ARTICLES
				$('#main div.post').remove();
				// REMOVE OLD COMMENTS
				$('#main #commentsContainer').remove();

				// update maxPages, nextPage, previousPage
				POSTS.maxPages = data.max_pages;
				POSTS.nextPage = data.next_page;
				POSTS.previousPage = data.previous_page;

				// update page link
				if (POSTS.maxPages <= 1) {
					POSTS.hidePageNavigation();
				} else {
					POSTS.updatePageLinks(category);
				}

				$.each(data.post_list, function() {

					// remove text after <!--more-->
					var moreIndex = this.fields.post_content.search("<!--more-->");
					if (moreIndex != -1) {
						this.fields.post_content = this.fields.post_content.substring(0, moreIndex);
						this.fields.post_content += "<h6><a class='postLink' href='" + this.fields.post_name + "/'>Continue...</a></h6>";
					}

					// format date
					this.fields.post_date =  formatDate(this.fields.post_date);

					// display post
					_posts.displayPost(this);
				});

				// trigger link event
				$('.source, .view').trigger('mouseout');
		});
	},

	// DISPLAY POSTS
	displayPost: function(content) {

		// ADD HTML
		var id = content.pk;
		// select link type
		var linkClass = "postLink";
		if (POSTS.contentType == "page") {
			linkClass = "pageLink";
		}
		$('<div class="post" id="' + id + '"><div class="header"><h2><a class="' + linkClass + '" href=""></a></h2><div class="date"></div><div class="clear"></div></div><div class="content"></div></div>')
		.hide().appendTo(this.container);

		// ADD CATEGORIES TO HEADER
		$.each(content.fields.post_categories, function() {
			$('<h3><a href="/category/' + this + '/">' + this + '</a></h3>').appendTo($('#' + id + ' div.header'));
		});

		// ADD CONTENT TO ARTICLE
		$('#' + id + ' a.' + linkClass).html(content.fields.post_title);
		$('#' + id + ' a.' + linkClass).attr('href', '/' + content.fields.post_name + '/');
		$('#' + id + ' div.content').html(content.fields.post_content);

		// Only display Date for Log posts
		if (POSTS.contentType == "log") {
			$('#' + id + ' div.date').html(content.fields.post_date);
		}

		// SHOW ARTICLES
		$('#' + id).fadeIn();

		$('html, body').scrollTop(0);
	},

	// UPDATE PAGE LINKS (next, previous)
	updatePageLinks: function(category) {

		POSTS.showPageNavigation();

		// set visibility
		if (POSTS.nextPage > POSTS.maxPages) {
			$('#nextPage').addClass('hide');
		} else {
			$('#nextPage').removeClass('hide');
		}
		if (POSTS.previousPage > 0) {
			$('#previousPage').removeClass('hide');
		} else {
			$('#previousPage').addClass('hide');
		}

		// update href
		$('#nextPage a').attr('href', '/category/' + category + '/' + POSTS.nextPage +'/');
		$('#previousPage a').attr('href', '/category/' + category + '/' + POSTS.previousPage +'/');
	},

	// HIDE PAGE NAVIGATION
	hidePageNavigation: function() {
		$('#pageNavigation').hide();
	},

	// SHOW PAGE NAVIGATION
	showPageNavigation: function() {
		$('#pageNavigation').show();
	}
};

/* COMMENTS NAMESPACE
---------------------------------------- */
var COMMENTS = {
	container: "#main",
	postID: 0,
	commentParent: 0,

	// GET COMMENTS
	getComments: function(postID) {
		var _comments = this;
		var data = {"postID":postID};
		this.postID = postID;

		$.ajax({
			url: '/json/getcomments/',
			dataType: 'json',
			cache: false,
			data: data,
			success: function(data) {
				// remove existing comments
				$('#commentsContainer').remove();
				// display comments
				_comments.displayComments(data.comment_list);
			}
		});
	},

	// DISPLAY COMMENTS
	displayComments: function(content) {
		// append comments container to #main
		var commentTitle = "";
		if (content.length === 0) {
			commentTitle = "No Comments";
		} else {
			commentTitle = content.length + " Comments";
		}
		$('<div id="commentsContainer"><h2>' + commentTitle + '</h2></div>').appendTo(this.container);

		// ADD COMMENTS TO commentsContainer
		$.each(content, function() {
			// format date
			this.fields.comment_date =  formatDate(this.fields.comment_date);

			var name = "";
			if (this.fields.comment_author_url !== "") {
				name = '<a href="' + this.fields.comment_author_url + '"target="_blank" rel="nofollow">' + this.fields.comment_author + '</a>';
			} else {
				name = this.fields.comment_author;
			}

			$('<div id="' + this.pk + '" class="comment commentLevel' + this.depth + '"><div class="content"><div class="t"></div><div class="name">' + name + '</div><div class="date">' + this.fields.comment_date + '</div><p>' + this.fields.comment_content + '</p></div><div class="b"><div></div></div></div>')
			.appendTo($('#commentsContainer'));

			// append and hide reply link only for level < 4
			if (this.depth < 4) {
				$('<div class="reply"><a href="' + this.pk + '">reply</a></div>').insertAfter('#' + this.pk + ' .name').hide();
			}
		});

		// append form
		$('<form id="commentForm" method="get"><h2>Post Comment</h2>' +
			'<div><input name="name" value="Name" id="inputName" class="commentInput" type="text"/></div>' +
			'<div><input name="url" value="URL" id="inputURL" class="commentInput" type="text"/></div>' +
			'<div><textarea name="comment" rows="10" cols="50"  id="inputComment" class="commentInput">Comment</textarea></div>' +
			'<div><button type="submit" id="commentSubmit" class="commentInput">SEND</button></div></form>')
			.appendTo($('#commentsContainer'));

		// save default value for each commentInput field
		$('.commentInput').each(function() {
			$(this).data('default', $(this).val()).addClass('inactive');
		});
	}
};

/* DOCUMENT READY
---------------------------------------- */
$(document).ready(function() {

	// JQUERY ADDRESS
	$.address.change(function(e) {

		if (POSTS.lastURL != e.value) {

			POSTS.lastURL = e.value;
			var urlArray = e.value.substring(1, e.value.length).split('/');

			// MAIN LOG
			if (e.value == '/') {
				POSTS.contentType = "log";
				POSTS.pageNumber = 1;
				POSTS.getPosts("all");

			// CATEGORY FILTER
			} else if (urlArray[0] == "category") {
				POSTS.contentType = "log";
				category = urlArray[1];
				// update pageNumber
				if (urlArray[2] !== undefined && urlArray[2] !== "") {
					POSTS.pageNumber = urlArray[2];
				} else {
					POSTS.pageNumber = 1;
				}

				POSTS.getPosts(category);

			// SINGLE PAGE
			} else if (urlArray[0] == "page") {
				POSTS.contentType = "page";
				page = urlArray[1];
				POSTS.getPost(page);

			// SINGLE POST
			} else {
				postName = urlArray[0];
				POSTS.getPost(postName);
			}
		}
	});

	/* STARTUP
	---------------------------------------- */

	POSTS.getPosts("all");

	// Get IE Version
	if($.browser.msie) {
		GLOBAL.IEVersion = parseInt($.browser.version.substring(0, 1), 10);
		GLOBAL.isIE = true;
	}

	// Fade in Header
	// Do not Animated Opacity in IE < 9
	if (!GLOBAL.isIE || GLOBAL.IEVersion >= 9) {
		$('h1').hide().delay(1000).fadeTo(2000, 1);
		// Fade in Navigation
		$('#navigation').hide().delay(200).fadeTo(1000, 1);
		// Fade In main section
		$('#main').hide().delay(500).fadeTo(1000, 1);
	}

	// Forms
	$('.commentInput').each(function() {
		$(this).data('default', $(this).val()).addClass('inactive');
	});

	// custom jquery function, scroll to element
	$.fn.scrollView = function () {
		return this.each(function () {
			$('html, body').animate({
				scrollTop: $(this).offset().top
			}, 500);
		});
	};


	/* EVENTS
	---------------------------------------- */
	// COMMENTS
	$('#commentsContainer > div.comment').live({
		mouseover: function() {
			var id = '#commentsContainer > #' + $(this).attr('id') + ' div.reply';
			$(id).stop(true).fadeTo(250, 1);
		},
		mouseout: function() {
			var id = '#commentsContainer > #' + $(this).attr('id') + ' div.reply';
			$(id).stop(true).fadeTo(150, 0);
		}
	});

	// COMMENT FORM
	$('.commentInput').live({

		focus: function() {
			$(this).removeClass('inactive');

			// textarea
			if ($(this).is("textarea") && $(this).val() == $(this).data('default') || '') {
				$(this).html("");
			}
			// input
			if($(this).val() == $(this).data('default') || '') {
				$(this).val('');
			}
		},
		blur: function() {
			var default_val = $(this).data('default');
			// textarea
			if ($(this).is("textarea") && $(this).html() === '') {
				$(this).addClass('inactive');
				$(this).html($(this).data('default'));
			}
			if($(this).val() === '') {
				$(this).addClass('inactive');
				$(this).val($(this).data('default'));
			}
		}
	});

	// SUBMIT COMMENT FORM
	$("form#commentForm").live({

		submit: function() {
			// get field data
			var name = $('#inputName').attr('value');
			var url = $('#inputURL').attr('value');
			var comment = $('#inputComment').attr('value');

			var data = {"name":name, "url":url, "comment":comment, "postID":COMMENTS.postID, "parent":COMMENTS.commentParent};

			// submit comment, turn off cache for IE
			$.ajax({
				url: '/json/submitcomment/',
				dataType: 'json',
				cache: false,
				data: data,
				success: function(data) {

					// check if status == 'success'
					if (data.status == 'success') {
					// Reset commentParent
					COMMENTS.commentParent = 0;
					// update comments
					COMMENTS.getComments(COMMENTS.postID);
					}
				}
			});

			return false;
		}
	});


	// COMMENT REPLY LINK
	$('.reply a').live({
		click: function() {

			GLOBAL.ignoreLinkEvent = true;
			COMMENTS.commentParent = $(this).attr('href');
				// IE FIX for jquery HREF which returns derived link instead of attribute value
			COMMENTS.commentParent = COMMENTS.commentParent.replace(GLOBAL.domain + '/', "");

			// Delete existing parent comment box
			$('#commentForm .comment').remove();
			// Change H2 'Post Comment' to 'Post Response to'
			$('#commentForm h2').html('Post Response to:');
			// Add parent comment box, get entire comment node by parentID
			$('#commentsContainer #' + COMMENTS.commentParent).clone().attr('id', 'parentResponse').insertAfter('#commentForm h2');
			// Change reply link to Close Reply link
			// Remove reply link
			$('#commentForm .comment .reply').remove();
			$('<div id="closeReply"><a href="close">cancel</a></div>').insertAfter('#commentForm .comment .name').hide();

			// Parent Response Box - mouseover, mouseout
			$('#parentResponse').mouseover(function() {
				$('#closeReply').stop(true).fadeTo(250, 1);
			}).mouseout(function() {
				$('#closeReply').stop(true).fadeTo(150, 0);
			});

			// scroll to comment form
			$('#commentForm').scrollView();
		}
	});

	// COMMENT CLOSE LINK
	$('#closeReply a').live({
		click: function() {
			GLOBAL.ignoreLinkEvent = true;
			// Restore H2
			$('#commentForm h2').html('Post Comment');
			// remove reply box
			$('#commentForm .comment').remove();
			// Reset commentParent
			COMMENTS.commentParent = 0;

			// scroll to comment form
			$('#commentForm').scrollView();
		}
	});


	// PROJECTS
	$('div.project').live({
		mouseover: function() {
			var id = '#' + $(this).attr('id') + ' div.image-box';
			$(id).stop(true).animate({height: 229}, {duration: 700, queue: false}).fadeTo(150, 1);
		},
		mouseout: function() {
			var id = '#' + $(this).attr('id') + ' div.image-box';
			$(id).stop(true).animate({height: 50}, {duration: 1500, queue: false}).fadeTo(150, 0.9);
		}
	});
	$('div.project').trigger('mouseout');

	// POST VIEW / SOURCE BUTTONS
	$('.source, .view').live({
		mouseover: function() {
			$(this).stop(true).animate({top: -2}, {duration: 25, queue: false}).fadeTo(50, 1);
		},
		mouseout: function() {
			$(this).stop(true).animate({top: 0}, {duration: 25, queue: false}).fadeTo(50, 0.7);
		}
	});
	$('.source, .view').trigger('mouseout');

	// NAVIGATION
	$('#main-navigation li a').mouseover(function() {
		if (!GLOBAL.isIE || GLOBAL.IEVersion >= 9) {
			$(this).stop(true).animate({left: -9}, {duration: 100, queue: false}).fadeTo(150, 1);
		} else {
			$(this).stop(true).animate({left: -9}, {duration: 100, queue: false});
		}
	}).mouseout(function() {
		if (!GLOBAL.isIE || GLOBAL.IEVersion >= 9) {
			$(this).stop(true).animate({left: 0}, {duration: 250, queue: false}).fadeTo(150, 0.9);
		} else {
			$(this).stop(true).animate({left: 0}, {duration: 250, queue: false});
		}
	});
	$('#main-navigation li a').trigger('mouseout');

	// SUB NAVIGATION
	$('#sub-navigation li a').append('<span class="hover"></span>').each(function () {
		var $span = $('> span.hover', this).css('opacity', 0);

		$(this).mouseover(function() {
			if (!GLOBAL.isIE || GLOBAL.IEVersion >= 9) {
				$span.stop().fadeTo(200, 1);
			} else {
				$span.css('opacity', 1);
			}
		}).mouseout(function() {
			if (!GLOBAL.isIE || GLOBAL.IEVersion >= 9) {
				$span.stop().fadeTo(200, 0);
			} else {
				$span.css('opacity', 0);
			}
		});

	});
	$('#sub-navigation li a').trigger('mouseout');


	// Jquery Address Link Handler
	$('a').address(function(event) {

		// check if link is to an internal page
		var href = $(this).attr("href");
		// IE FIX for jquery HREF which returns derived link instead of attribute value
		href = href.replace(GLOBAL.domain, "");

		// load external link as normal
		if (href.substring(0, 7) == "http://" || href.substring(0, 8) == "https://" || href.substring(0, 7) == "mailto:") {

			if ($(this).attr("target") == "_blank") {
				window.open(href, '_blank');
			} else {
				window.location.replace(href);
			}
		// use Jquery Address for internal links
		} else {
			if (!GLOBAL.ignoreLinkEvent) {

				// remove '/log/' from link
				return href;
			}

			GLOBAL.ignoreLinkEvent = false;
		}
	});
});