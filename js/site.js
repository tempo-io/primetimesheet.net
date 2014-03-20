var scrollToTop = function(event) {
	var el = $(event.target.attributes['href']);
	$("html, body").animate({
		scrollTop: el.offset().top + "px"
	}, {
		duration: 400,
		easing: "swing"
	});
	return false;
}

$(function() {
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

    $('#slider').nivoSlider();

    $('#at4-soc').click(function() {
        $.getScript('//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5206946308988819', function() {
            addthis.layers({
              'theme' : 'transparent',
              'share' : {
                'position' : 'left',
                'numPreferredServices' : 5
              }   
            });
        });
    });

    var loading = function(isLoading) {
      var $e = $('#loading');
      isLoading === true ? $e.show() : $e.hide();
    }

    var submitted = false;
    $('#demoLicense form').validate({
        submitHandler: function(form, event) {
            if (submitted) {
                return;
            }
            submitted = true;
            loading(true);
            var $form = $(form);
            $.ajax({
                url: form.action,
                cache: false,
                type: 'POST',
                data: $form.serialize(),
                dataType: "jsonp",
                //timeout: 1000,
                crossDomain: true,
                success: function (data, status) {
                    if (data == 'OK') {
                        $form.parent().css('color', '#317eac').html("You should recieve license to specified email shortly.")
                    } else {
                        $form.parent().css('color', '#d14').html("Error: " + data);
                    }
                },
                error: function (xOptions, textStatus) {
                    submitted = false;
                    console.log(textStatus);
                },
                complete: function() {
                    loading(false);
                }
            });
        }
     });
});

