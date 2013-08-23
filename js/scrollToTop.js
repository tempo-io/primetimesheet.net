var scrollToTop = function(element) {
	var el = (typeof element == 'string') ? $('#' + element) : $($('a.back-to-top').attr("data-href"));
	$("html, body").animate({
		scrollTop: el.offset().top - 45 + "px"
	}, {
		duration: 400,
		easing: "swing"
	});
	return false;
}

$(document).ready(function() {
	$('a.back-to-top').live('click', scrollToTop);

    function el(event) {
	    return event.target.localName == 'span' ?
	        $(event.target) : $('span', event.target);
    }

	$('h3').live('mouseleave', function(event) {
		el(event).hide();
	}).live('mouseenter', function(event) {
		el(event).show();
	})
});
