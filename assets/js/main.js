$(document).ready(function (){
  'use strict';

  // Toggle crew members.
  // Set the right margin first.
  var $crewMembers = $('#crew-members');
  $crewMembers.removeClass('expanded');
  $('#crew-members-expander').addClass('expander');
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

  // Preload background images.
  $('.backdrop').each(function (index, element) {
    var $element = $(element);
    var url = $element.css('background-image');
    if (url !== 'none') {
      // Retrieve background class name.
      var bgClass = '';
      element.className.split(/\s+/).forEach(function (className) {
        if (className.indexOf('bg-') !== -1) {
          bgClass = className;
        }
      });
      $element.removeClass(bgClass);
      var $loader = $('<div class="backdrop-loader"></div>');
      $element.prepend($loader);
      var $image = $('<img>');
      $image.load(function () {
        $element.addClass(bgClass);
        $loader.css('background-color', 'transparent');
      });
      $image.attr('src', url.replace(/url\(['"]?([^'"]*)['"]?\)/, '$1'));
    }
  });

  // Show elements which are hidden without JS.
  $('.nojs-hidden').removeClass('nojs-hidden');

  // Re-enable CSS transitions.
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
      $slider.click(function (ev) {
        ev.preventDefault();
        $slider.animate({ top: '-100vh', bottom: '0' }, 1000, function () {
          $slider.remove();
        });
        return false;
      });
      $slider.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () { $slider.remove(); });
    }
  }

  // Contact form submission.
  var $form = $('#contact-form');
  $form.submit(function (ev) {
    ev.preventDefault();
    $.post(
      $form.attr('action'),
      {
        first_name: $('#contact-fn').val(),
        last_name:  $('#contact-ln').val(),
        email:      $('#contact-email').val(),
        message:    $('#contact-msg').val(),
        js:         true
      },
      function (data) {
        var $formMessage = $('#contact-success');
        if (data.success === true) {
          $formMessage.hide('slow', function () {
            $formMessage.removeClass('error');
            $formMessage.text('Your message has been successfully sent to us.');
            $formMessage.show('slow');
            $form[0].reset();
          });
        }
        else {
          $formMessage.hide('slow', function () {
            $formMessage.addClass('error');
            $formMessage.text('There was an error. Please check your input and try again.');
            $formMessage.show('slow');
          });
        }
      },
      "json"
    );
    return false;
  });

  // Load gallery configuration.
  var galleryConfig = $('#config').text();
  if (galleryConfig) {
    galleryConfig = JSON.parse(galleryConfig);
  }

  var fullscreen = false;
  var $galleryGridView = $('#gallery-grid-view');
  var closeGalleryGrid = function () {
    $galleryGridView.addClass('hide');
    $galleryGridView.removeClass('show');
    setTimeout(function () { $galleryGridView.removeClass('hide') }, 400);
  };

  var $galleryActive = $('#gallery-active');
  var $galleryActiveElement = $galleryActive.children().first();
  var loadGalleryElement = function (id, fullscreen) {
    $galleryActive.addClass('loading');
    $galleryActiveElement.load(function () {
      $galleryActive.removeClass('loading');
    });
    $galleryActiveElement.attr('alt', galleryConfig[id].alt);
    if (fullscreen === true) {
      var src = galleryConfig[id].url;
    }
    else {
      src = galleryConfig[id].preview;
    }
    $galleryActiveElement.attr('src', src);
  };

  // Toggle gallery grid view.
  $('#gallery-grid').click(function (ev) {
    ev.preventDefault();
    $galleryGridView.addClass('hide');
    $galleryGridView.addClass('show');
    $galleryGridView.removeClass('hide');
    // Only append images if they haven't been loaded yet.
    if (!$galleryGridView.hasClass('loaded')) {
      var $content = $('#gallery-grid-view-content');
      galleryConfig.forEach(function (element) {
        $('<img>', {
          alt:      element.alt,
          'class':  'img-responsive img-framed img-grayscale',
          on:       {
            click:  function (ev) {
              ev.preventDefault();
              loadGalleryElement(element.id, fullscreen);
              closeGalleryGrid();
              return false;
            }
          },
          src:      element.thumb
        }).appendTo($('<div class="col-xs-6 col-sm-4"></div>').appendTo($content));
      });
      $galleryGridView.addClass('loaded');
    }
    return false;
  });
});
