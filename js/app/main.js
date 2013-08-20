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

