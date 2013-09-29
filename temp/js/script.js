/*
* This file is part of the "4000 mile stare" website.
* @author Markus Deutschl <mdeutschl.mmt-m2012@fh-salzburg.at>
*/

(function ($, window) {
  $(function () {
    // Smooth local scrolling.
    $('#main-navigation, #back-to-top').localScroll();

    // Mail form submission.
    $('#mail-form').submit(function (event) {
      event.preventDefault();
      $.post(
        "/submit.php",
        {
          first_name: $('#first-name').val(),
          last_name: $('#last-name').val(),
          email: $('#email').val(),
          message: $('#message').val()
        },
        function (data, textStatus, jqXHR) {
          var $response = $('#mail-form_response');
          if (data.success === true) {
            $response.hide('slow', function () {
              $response.removeClass('error');
              $response.text('Your message has been successfully sent to us.');
              $response.show('slow');
              $('#reset').click();
            });
          }
          else {
            $response.hide('slow', function () {
              $response.addClass('error');
              $response.text('There was an error. Please check your input and try again.');
              $response.show('slow');
            });
          }
        },
        "json"
      );
      return false;
    });
  });
})(window.jQuery, window);
