function fullscreenEnabled() {
  'use strict';
  if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
    return true;
  }
  return false;
}

function launchFullscreen(element) {
  'use strict';
  if (element.requestFullscreen) {
    element.requestFullscreen();
  }
  else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  }
  else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
  else if (element.msRequestFullScreen) {
    element.msRequestFullScreen();
  }
  else {
    return false;
  }
}

function exitFullscreen() {
  'use strict';
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  else {
    return false;
  }
}

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
  $('.preload').addClass('loading');
  $('.preload > .embed-responsive-item, .preload > img').each(function (index, element) {
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

  var $galleryGridView = $('#gallery-grid-view');
  var closeGalleryGrid = function () {
    $galleryGridView.addClass('hide');
    $galleryGridView.removeClass('show');
    setTimeout(function () { $galleryGridView.removeClass('hide') }, 400);
  };

  var $galleryActive = $('#gallery-active');
  var $galleryActiveElement = $galleryActive.children().first();
  var $galleryPrev = $('#gallery-previous');
  var $galleryNext = $('#gallery-next');
  var loadGalleryElement = function (id, fullscreen) {
    // Out of bounds.
    if (id < 0 || id >= galleryConfig.length) {
      return false;
    }

    $galleryPrev.removeClass('active');
    $galleryNext.removeClass('active');

    // First element.
    if (id === 0) {
      $galleryPrev.addClass('active');
    }

    // Last element.
    if (id === galleryConfig.length - 1) {
      $galleryNext.addClass('active');
    }

    $galleryActive.addClass('loading');
    $galleryActiveElement.load(function () {
      $galleryActive.removeClass('loading');
    });
    $galleryActiveElement.attr('alt', galleryConfig[id].alt);
    $galleryActive.attr('data-id', id);
    var src = '';
    if (fullscreen === true) {
      src = galleryConfig[id].url;
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
              loadGalleryElement(element.id, fullscreenEnabled());
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

  // Go to previous gallery element.
  $galleryPrev.click(function (ev) {
    ev.preventDefault();
    loadGalleryElement(parseInt($galleryActive.attr('data-id'), 10) - 1, fullscreenEnabled());
    return false;
  });

  // Enable swiping.
  $galleryActiveElement.on('swipeleft', function () {loadGalleryElement(parseInt($galleryActive.attr('data-id'), 10) + 1, fullscreenEnabled());});
  $galleryActiveElement.on('swiperight', function () {loadGalleryElement(parseInt($galleryActive.attr('data-id'), 10) - 1, fullscreenEnabled());});
  // Re-enable vertical scrolling.
  $galleryActiveElement.on('movestart', function (ev) {
    if ((ev.distX > ev.distY && ev.distX < -ev.distY) ||
        (ev.distX < ev.distY && ev.distX > -ev.distY)) {
      ev.preventDefault();
      return false;
    }
  });

  // Go to next gallery element.
  $galleryNext.click(function (ev) {
    ev.preventDefault();
    loadGalleryElement(parseInt($galleryActive.attr('data-id'), 10) + 1, fullscreenEnabled());
    return false;
  });

  // Open image in fullscreen mode.
  $('#gallery-fullscreen, #gallery-active img').click(function (ev) {
    ev.preventDefault();
    if (fullscreenEnabled() === false) {
      loadGalleryElement(parseInt($galleryActive.attr('data-id'), 10), true);
      launchFullscreen($galleryActive[0].parentNode);
    }
    else {
      exitFullscreen();
    }
    return false;
  });

  var galleryFullscreenImage = $('#gallery-fullscreen')[0].firstChild;
  $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function (event) {
    if (fullscreenEnabled() === true) {
      galleryFullscreenImage.src = '/assets/img/popin.svg';
    }
    else {
      galleryFullscreenImage.src = '/assets/img/popout.svg';
    }
    return event;
  });
});
