$(document).ready(function (){
  'use strict';

  // Toggle mobile menu.
  $('#mobile-menu').click(function (ev) {
    ev.preventDefault();
    $('#header').toggleClass('expanded');
    $('#mobile-menu').toggleClass('expanded');
    return false;
  });

  // Toggle crew members.
  $('#crew-members-expander').click(function (ev) {
    ev.preventDefault();
    $('#crew-members').toggleClass('expanded');
    $('#crew-members-expander').toggleClass('expanded');
    return false;
  });
});
