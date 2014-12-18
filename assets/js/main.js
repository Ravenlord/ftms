$(document).ready(function (){
  'use strict';
  $('body').removeClass('no-transition');

  // Load iframe elements in background.
  // Hide all iframes from sight and display loading animation.
  $('.embed-responsive').addClass('loading');
  $('.embed-responsive-item').each(function (index, element) {
    // Bind handler for load completion.
    $(element).load(function () {
      // Hide loading animation and show actual content.
      $(this.parentNode).removeClass('loading');
    });
    // Specify the source of the iframe to start loading.
    element.src = element.dataset.src;
  });

  // Toggle mobile menu.
  $('#mobile-menu').click(function (ev) {
    ev.preventDefault();
    $('#header').toggleClass('expanded');
    $('#mobile-menu').toggleClass('expanded');
    return false;
  });

  // Remove slider from index page.
  var $slider = $('#slider');
  if ($slider.length > 0) {
    if ($.cookie('ftms')) {
      $slider.remove();
    }
    else {
      $.cookie('ftms', true, { expires: 1 });
      $slider.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () { $slider.remove(); });
    }
  }

  // Toggle crew members.
  // Set the right margin first.
  var $crewMembers = $('#crew-members');
  $crewMembers.css('margin-top', '-' + ($crewMembers.height() + parseInt($crewMembers.css('padding-bottom'), 10)) + 'px');
  $('#crew-members-expander').click(function (ev) {
    ev.preventDefault();
    var $this = $(this);

    if ($this.hasClass('expanded')) {
      $crewMembers.css('margin-top', '-' + ($crewMembers.height() + parseInt($crewMembers.css('padding-bottom'), 10)) + 'px');
      $crewMembers.removeClass('expanded');
      $this.removeClass('expanded');
    }
    else {
      $crewMembers.css('margin-top', 0);
      $crewMembers.addClass('expanded');
      $this.addClass('expanded')
    }
    return false;
  });
});
