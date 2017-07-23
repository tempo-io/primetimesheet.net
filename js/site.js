$(function() {
  $('#dropdownMenu').on('show.bs.dropdown', function () {
    //https://stackoverflow.com/questions/32381746/handle-twitter-bootstrap-dropdown-clipped-issue-having-overflow-auto-on-containe
    var $this = $(this);
    var $dropdown = $this.find('.dropdown-menu');
    $dropdown.css('position', 'fixed');
    $dropdown.css('top', /* fixed $this.offset().top + */ $this.height() + 20 /* padding */);
  });

  var el = function (event) {
    return event.target.localName == 'span' ?
      $(event.target) : $('span', event.target);
  };

  $('h3').on('mouseleave', function(event) {
    el(event).hide();
  }).on('mouseenter', function(event) {
    el(event).show();
  });  
});
