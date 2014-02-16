var loading = function(isLoading) {
  var $e = $('#loading');
  isLoading === true ? $e.show() : $e.hide();
}

var g_wiki_page;

// initialize
var app = Sammy('#content', function() {
  this.use('Title');
  this.use('GoogleAnalytics');
  
  this.setTitle(function(page) {
    if (page != '') {
      page += ' | ';
    }
    return page + 'JIRA Timesheet Plugin';    
  });

  var current = function(selector, id) {
    if ($(selector + '.active').id != id) {
      $(selector).removeClass('active');
      $('#' + id).addClass('active');
    }
  }

  var current_menu = function(id) {
    current('ul.nav li', id)
  }

  var current_sidemenu = function(id) {
    current('.sidemenu ul li', id)
  }

  this.preloadImages = function() {
    var images = new Array();
    for (i = 0; i < arguments.length; i++) {
      images[i] = new Image()
      images[i].src = arguments[i]
    }
  }

  this.preloadImages(
    // Home
    "images/slider/timesheet-plugin-banner.png",
    // wiki/Overview
    "http://bitbucket.org/azhdanov/jiratimesheet/wiki/Overview/timesheet_report.png",
    //"http://bitbucket.org/azhdanov/jiratimesheet/wiki/Overview/pivot_report.png",
    // wiki/Multiple Time Zones
    "http://bitbucket.org/azhdanov/jiratimesheet/wiki/Version%202.3.7/Worklog-admin.png",
    // Unified Plugin Views
    "http://bitbucket.org/azhdanov/jiratimesheet/wiki/Version%202.3.6/timesheet-options.png"
  );

  this.get(/#\/wiki\/([^\/]+)\/?(.*)/, function(context) {
    current_menu('wiki');
    g_wiki_page = this.params.splat[0];
    var page = g_wiki_page.replace(/_/g,' ');
    this.title(page);
    var wiki = this.load('templates/wiki.html'); // parallel
    var ref = this.params.splat[1];
    this.load('http://api.bitbucket.org/1.0/repositories/azhdanov/jiratimesheet/wiki/' + g_wiki_page,
        {jsonp: true, cache: true, loading: loading}, function(data) {
      var main = $('<div/>', {id: 'main'});
      wiki.then(function(html) {
        context.swap(html);
        $('#main h2').text(page).after(markdown.toHTML(data.data));
        current_sidemenu(page.replace(/\s/g, '-'));
        scrollToTop(ref || 'top');
        $('a.back-to-top').attr('href', '#/wiki/' + g_wiki_page);
      });
    });
  });

  this.get('#/:page', function(context) {
    var page = this.params.page;
    this.title(page.charAt(0).toUpperCase() + page.slice(1));
    current_menu(page);
    this.load('templates/' + page + '.html', {loading: loading}).swap(function() {
      if (typeof gapi == 'object' && page == 'roadmap') { // if loaded
        gapi.plusone.go();
        FB.XFBML.parse();
        $('.vk-like').each(function(i, e) {
	      VK.Widgets.Like(e.id, {type: "button", height: 22, pageUrl: $(e).attr('data-href')});
	    });
      } else if (page == 'license') {
		    var submitted = false;
		    var $form = $('#demoLicense form');
		    $form.validate({
		        submitHandler: function(form) {
		            if (submitted) {
		                return;
		            }
		            submitted = true;
		            loading(true);
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
                                $form.parent().html("You should recieve license to specified email shortly.")
                            } else {
                                $form.parent().html("Error: " + data);
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
      }
      $('a.back-to-top').attr('href', '#' + page);
    });
    scrollToTop('top');
  });

  // <any>.html, #, #/
  this.get('/(.*\.html)?(#/)?$', function(context) {
    this.title();
    current_menu('home');
    this.load('templates/main.html', {loading: loading}).swap(function() {
      $('#slider').nivoSlider();
    });
    scrollToTop('top');
    $('a.back-to-top').attr('href', '#');
  });

  // AMKT-4682 (not used, see sammy-0.7.2.js#_checkLocation)
  this.get('#wiki', function (context) {
	context.redirect('#/wiki/Overview');
  });

});

$(function () {
  app.run();
});

