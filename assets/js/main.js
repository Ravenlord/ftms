$(document).ready(function (){
  'use strict';

  // Toggle mobile menu.
  $('#mobile-menu').click(function (ev) {
    ev.preventDefault();
    var $header = $('#header');
    var $mobileMenu = $('#mobile-menu')
    if ($header.hasClass('expanded')) {
      $header.removeClass('expanded');
      $mobileMenu.removeClass('expanded');
    }
    else {
      $header.addClass('expanded');
      $mobileMenu.addClass('expanded');
    }
    return false;
  });
});
