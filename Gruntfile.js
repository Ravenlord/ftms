module.exports = function(grunt) {
  'use strict';


  // ------------------------------------------------------------------------------------------------------------------- Includes


  // Imagemin compressors.
  var mozjpeg = require('imagemin-mozjpeg');
  var pngquant = require('imagemin-pngquant');


  // ------------------------------------------------------------------------------------------------------------------- Configuration


  grunt.initConfig({
    // Apply vendor prefixes to CSS files.
    autoprefixer: {
      options: {
        browsers: [
          "Android 2.3",
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 8",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6"
        ]
      },
      dist: {
        cwd:      'dist/assets/css/',
        dest:     'dist/assets/css/',
        expand:   true,
        options:  {
        },
        src:      [ '*.css', '!*.min.css' ]
      }
    },

    // Bootstrap linter.
    bootlint: {
      files: [ 'dist/**/*.html' ]
    },

    // Concatenate source files and move them to the output directory.
    concat: {
      options: {
        stripBanners: { block: true, line: true}
      },
      css: {
        dest:   'dist/assets/css/main.css',
        src:    [
                  'assets/css/bootstrap.css',
                  'assets/css/base/font.css',
                  'assets/css/base/general.css',
                  'assets/css/base/header-footer.css',
                  'assets/css/base/content.css',
                  'assets/css/modules/*.css'
                ]
      },
      jsBottom: {
        dest: 'dist/assets/js/main.js',
        src:  [ 'assets/js/lib/jquery.min.js', 'assets/js/lib/jquery.cookie.min.js', 'assets/js/main.js' ]
      },
      jsTop:  {
        dest: 'dist/assets/js/shim.min.js',
        src:  [ 'assets/js/lib/html5shiv.min.js', 'assets/js/lib/respond.min.js' ]
      }
    },

    // Copy source files.
    copy: {
      apache: {
        dest: 'dist/.htaccess',
        src:  'config/apache/.htaccess'
      },
      bootstrap: {
        cwd:    'node_modules/bootstrap/less',
        dest:   'dist/temp/bootstrap/',
        expand: true,
        src:    [ '**', '!bootstrap.less', '!variables.less' ]
      },
      bootstrapConfig: {
        cwd:    'config/bootstrap',
        dest:   'dist/temp/bootstrap/',
        expand: true,
        src:    '*.less'
      },
      font: {
        dest: 'dist/',
        src:  'assets/font/*'
      },
      gallery: {
        dest: 'dist/assets/img/',
        src:  'media/**/*.{png,jpg,gif,svg}'
      },
      img: {
        dest: 'dist/',
        src:  'assets/img/**/*.{png,jpg,gif,svg}'
      }
    },

    // Delete directories.
    clean: {
      dist:     [ 'dist/' ],
      prodCSS:  [ 'dist/assets/css/*.css', '!dist/assets/css/*.min.css' ],
      prodJS:  [ 'dist/assets/js/*.js', '!dist/assets/js/*.min.js' ],
      temp:     [ 'dist/temp/' ]
    },

    // Order CSS properties and tidy it.
    csscomb: {
      options: {
        // Use bootstrap's config.
        config: 'node_modules/bootstrap/less/.csscomb.json'
      },
      dist: {
        cwd:    'dist/assets/css/',
        dest:   'dist/assets/css/',
        expand: true,
        src:    [ '*.css', '!*.min.css' ]
      }
    },

    // Lint CSS with the bootstrap configuration.
    csslint: {
      options: {
        csslintrc:  'node_modules/bootstrap/less/.csslintrc',
        ids:        false
      },
      css: [ 'assets/css/**/*.css', '!assets/css/bootstrap.css' ]
    },

    // Minify CSS.
    cssmin: {
      dist: {
        expand:              true,
        ext:                 '.min.css',
        keepSpecialComments: 0,
        src:                 'dist/assets/css/*.css'
      }
    },

    // Download external dependencies.
    downloadfile: {
      files: [
        {
          dest: 'assets/js/lib/',
          name: 'html5shiv.min.js',
          url:  'https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js'
        },
        {
          dest: 'assets/js/lib/',
          name: 'jquery.min.js',
          url:  'https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'
        },
        {
          dest: 'assets/js/lib/',
          name: 'jquery.cookie.min.js',
          url:  'https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.3.1/jquery.cookie.min.js'
        },
        {
          dest: 'assets/js/lib/',
          name: 'respond.min.js',
          url:  'https://oss.maxcdn.com/respond/1.4.2/respond.min.js'
        }
      ]
    },

    // Upload source files with FTP.
    'ftp-deploy': {
      easyname: {
        auth: {
          authKey:  'easyname',
          host:     'e36295-ftp.services.easyname.eu',
          port:     21
        },
        dest:       'html/deploy/',
        exclusions: [ 'dist/**/.DS_Store', 'dist/**/Thumbs.db' ],
        src:        'dist/'
      }
    },

    // Minify HTML.
    htmlmin: {
      options: {
        collapseWhitespace: true,
        //lint:               true,
        removeComments:     true
      },
      dist: {
        files: [{
          cwd:    'dist/',
          dest:   'dist/',
          expand: true,
          src:    '**/*.html'
        }]
      }
    },

    // Optimize images and put them into the output directory.
    imagemin: {
      dist: {
        options: {
          use:  [ mozjpeg(), pngquant() ]
        },
        files:  [{
          dest:   '',
          expand: true,
          src:    'dist/assets/img/**/*.{png,jpg,gif,svg}'
        }]
      }
    },

    // Resize images.
    image_resize: {
      castCrew: {
        options:  { width: 460 },
        files: [{
          dest:     '',
          expand:   true,
          src:      [ 'dist/assets/img/cast/*.{png,jpg,gif}', 'dist/assets/img/crew/**/*.{png,jpg,gif}' ]
        }]
      },
      mediaGalleryPreview: {
        options:  { width: 780 },
        files: [{
                  dest:     'dist/assets/img/media/gallery/previews/',
                  expand:   true,
                  flatten:  true,
                  src:      [ 'media/gallery/*.{png,jpg,gif}' ]
        }]
      },
      mediaGalleryThumb: {
        options:  { width: 300 },
        files: [{
                  dest:     'dist/assets/img/media/gallery/thumbs/',
                  expand:   true,
                  flatten:  true,
                  src:      [ 'media/gallery/*.{png,jpg,gif}' ]
                }]
      },
      videoGalleryThumb: {
        options:  { width: 300 },
        files: [{
                  dest:     'dist/assets/img/media/video/thumbs/',
                  expand:   true,
                  flatten:  true,
                  src:      [ 'media/video/thumbs/*.{png,jpg,gif}' ]
                }]
      }
    },

    // Lint the JS files with bootstrap's configuration.
    jshint: {
      options: {
        jshintrc: 'node_modules/bootstrap/js/.jshintrc'
      },
      // Also lint grunt files.
      grunt: {
        options:  {
          jshintrc: 'node_modules/bootstrap/grunt/.jshintrc'
        },
        src:  'Gruntfile.js'
      },
      js: {
        src:  'assets/js/*.js'
      }
    },

    // Compile less files.
    less: {
      bootstrap: {
        dest: 'assets/css/bootstrap.css',
        options: {
          strictMath: true
        },
        src:  'dist/temp/bootstrap/bootstrap.less'
      }
    },

    // Pretty print HTML for development purposes.
    prettify: {
      all: {
        cwd:    'dist/',
        dest:   'dist/',
        expand: true,
        src:    '**/*.html'
      }
    },

    // Uglify JavaScript, unfortunately the uglify task cannot glob properly.
    uglify: {
      options:  {
        preserveComments: false
      },
      // Target for main.js.
      main:     {
        dest: 'dist/assets/js/main.min.js',
        src:  'dist/assets/js/main.js'
      }
    },

    // Validate HTML.
    validation: {
      options: {
        charset:  'utf-8',
        doctype:  'HTML5',
        failHard: true,
        reset:    true
      },
      html: {
        src:  'dist/**/*.html'
      }
    },

    // File watcher for development convenience.
    watch: {
      // Copy apache config on changes.
      apache: {
        files:  'config/apache/.htaccess',
        tasks:  'copy:apache'
      },
      // Recompile bootstrap on less changes.
      bootstrap: {
        files:  'config/bootstrap/**/*.less',
        tasks:  [ 'css-dev' ]
      },
      // Reprocess CSS files on changes.
      css: {
        files:  'assets/css/**/*.css',
        tasks:  [ 'csslint:css', 'concat:css', 'autoprefixer:dist', 'csscomb:dist' ]
      },
      // Lint Gruntfile on changes.
      grunt: {
        files:  'Gruntfile.js',
        tasks:  'jshint:grunt'
      },
      // Rebuild HTML output on changes.
      html: {
        files:  [ 'config/html/**/*.html', 'content/**/*.html' ],
        tasks:  'html-dev'
      },
      // Optimize images on changes.
      img: {
        files:  'assets/img/**/*.{png,jpg,gif,svg}',
        tasks:  [ 'images' ]
      },
      // Copy JS files on changes.
      js: {
        files:  'assets/js/**/*.js',
        tasks:  [ 'js-dev' ]
      }
    }
  });


  // ------------------------------------------------------------------------------------------------------------------- Helper functions


  /**
   * Inserts the CSS includes into a page.
   *
   * @param source string
   *   The source content which needs the includes.
   * @param pageName string
   *   The name of the current page.
   * @param cssDir string
   *   The directory where the stylesheets are located.
   * @param production boolean
   *   Determines if the uncompressed or compressed CSS files will be included.
   * @return string
   *   The source content with the includes.
   */
  function insertCSS(source, pageName, cssDir, production) {
    var includes = '';
    // Main CSS file will always be included.
    var stylesheets = [ 'main' ];

    // Construct the includes.
    stylesheets.forEach(function (stylesheet) {
      includes += '<link href="/assets/css/' + stylesheet;
      // Include minified CSS if in production mode.
      if (production === true) {
        includes += '.min';
      }
      includes += '.css" rel="stylesheet">\n';
    });

    return source.replace('##CSS##', includes);
  }

  /**
   * Inserts the page footer into a page.
   *
   * @param source string
   *   The source content which needs the header.
   * @param file string
   *   The file which reflects the current page.
   * @param footer string
   *   The footer template.
   * @param footerLinks object
   *   The footer links extracted from the menu tree.
   * @param production boolean
   *   Build the links in development or production format.
   * @return string
   *   The page with the inserted footer.
   */
  function insertFooter(source, file, footer, footerLinks, production) {
    var html = source.replace('##FOOTER##', footer);
    var regex;
    for (var page in footerLinks) {
      // Add html suffix to footer links if we are in dev mode.
      if (production === false) {
        regex = new RegExp('(<a class=".*" href=".*)(">' + footerLinks[page].name + '</a>)', 'i');
        html = html.replace(regex, '$1.html$2');
      }
      if (page === file) {
        // Add active class if this page is the current one.
        regex = new RegExp('(<a class=".*)(" href=").*(">' + footerLinks[page].name + '</a>)');
        html = html.replace(regex, '$1 active$2#$3');
      }
    }

    return html;
  }

  /**
   * Inserts the page header into a page.
   *
   * @param source string
   *   The source content which needs the header.
   * @param header string
   *   The header template.
   * @return string
   *   The page with the inserted header.
   */
  function insertHeader(source, header) {
    // Don't output the header if it's an index page.
    return source.replace('##HEADER##', header);
  }

  /**
   * Inserts the JavaScript includes into a page.
   *
   * @param source string
   *   The source content which needs the includes.
   * @param pageName string
   *   The name of the current page.
   * @param jsDir string
   *   The directory where the scripts are located.
   * @param production boolean
   *   Determines if the uncompressed or compressed JS files will be included.
   * @return string
   *   The source content with the includes.
   */
  function insertJS(source, pageName, jsDir, production) {
    var includes = '';
    // Main JS file will always be included.
    var scripts = [ 'main' ];

    // Construct the includes.
    scripts.forEach(function (script) {
      includes += '<script src="/assets/js/' + script;
      // Include minified JS if in production mode.
      if (production === true) {
        includes += '.min';
      }
      includes += '.js"></script>\n';
    });

    return source.replace('##JS##', includes);
  }

  /**
   * Inserts the 4000 mile stare menu with the current page active into a page.
   *
   * @param source string
   *   The source content which needs the menu.
   * @param menuTree object
   *   The hierarchical menu tree.
   * @param file  string
   *   The file which reflects the current page.
   * @param production boolean
   *   Determines if the routes are generated in production mode or not.
   * @return string
   *   The source content with the menu.
   */
  function insertMenu(source, menuTree, file, production) {
    var menu = '<ul>';

    // Class strings for links.
    var firstLevelClass   = 'main-nav-first';
    var secondLevelClass  = 'main-nav-second';

    for (var firstLevel in menuTree) {
      if (menuTree.hasOwnProperty(firstLevel)) {
        // Skip index page and footer altogether.
        if (firstLevel === 'index.html' || firstLevel === 'footer') {
          continue;
        }
        var firstClassString  = firstLevelClass;
        var href              = '/' + nameToURL(menuTree[firstLevel].name);
        if (production === false) {
          href += '.html';
        }
        // Only a first level page, just add it.
        if (menuTree[firstLevel].children === false) {
          // Set the correct route for the index page.
          if (menuTree[firstLevel].name.toLowerCase() === 'base') {
            href = '/';
          }

          // Set menu point active.
          if (firstLevel === file) {
            firstClassString += ' active';
            href = '#';
          }
          menu += '<li class="' + firstClassString + '"><a href="' + href + '">' + menuTree[firstLevel].name + '</a></li>';
        }
        // Process second level and set parent active as well.
        else {
          var secondaryLinks  = '';
          for (var secondLevel in menuTree[firstLevel].children) {
            if (menuTree[firstLevel].children.hasOwnProperty(secondLevel)) {
              href = '/' + nameToURL(menuTree[firstLevel].name) + '/'
                + nameToURL(menuTree[firstLevel].children[secondLevel].name);
              var secondClassString = secondLevelClass;
              if (production === false) {
                href += '.html';
              }
              // Set menu point active.
              if (secondLevel === file) {
                firstClassString  += ' active';
                secondClassString += ' active';
                href    = '#';
              }
              secondaryLinks += '<li class="' + secondClassString + '"><a href="' + href + '">'
                + menuTree[firstLevel].children[secondLevel].name + '</a></li>';
            }
          }
          // Secondary items processed, add the first level menu point.
          menu += '<li class="' + firstClassString + '" tabindex="0"><span>' + menuTree[firstLevel].name + '</span>'
              + '<ul class="main-nav-second-wrapper">'
                + secondaryLinks
              + '</ul>'
            + '</li>'
          ;
        }
      }
    }

    return source.replace('##MENU##', menu + '</ul>');
  }

  /**
   * Inserts the content, title and page name into a page.
   *
   * @param source string
   *   The source content which needs the includes.
   * @param pageName string
   *   The name of the current page.
   * @param content string
   *   The page's content.
   * @return string
   *   The page with page contents, title and page name inserted..
   */
  function insertPageContent(source, pageName, content) {
    // Replace page content.
    var html = source.replace(
      '##CONTENT##',
      content
    );

    // Replace the page title.
    if (pageName.indexOf('footer') > -1) {
      // Strip footer directory from name.
      pageName = pageName.toLowerCase().replace('footer/', '');
    }
    html = html.replace('##TITLE##', pageName.toUpperCase() + ' — ');

    // Replace the page name.
    html = html.replace(/##PAGENAME##/g, nameToURL(pageName));

    return html;
  }


  function makeGallery(template, config, distributionDirectory, baseURL, fileOptions, production) {
    var result;
    var galleryTemplate = template.replace('##CONFIG##', JSON.stringify(config));
    config.forEach(function (element, index) {
      var galleryPageContents = galleryTemplate
            .replace('##GALLERY_ACTIVE_ID##', element.id)
            .replace('##GALLERY_ACTIVE_HREF##', element.url)
            .replace(/##GALLERY_ACTIVE_SRC##/g, element.preview)
            .replace('##GALLERY_ACTIVE_ALT##', element.alt)
        ;

      if (index === 0) {
        galleryPageContents = galleryPageContents
          .replace('##GALLERY_PREVIOUS_ACTIVE##', ' active')
          .replace('##GALLERY_PREVIOUS_HREF##', '')
        ;
      }
      else {
        galleryPageContents = galleryPageContents.replace('##GALLERY_PREVIOUS_ACTIVE##', '');
        if (index === 1) {
          galleryPageContents = galleryPageContents.replace('##GALLERY_PREVIOUS_HREF##', ' href="' + baseURL +'.html"');
        }
        else {
          galleryPageContents = galleryPageContents.replace('##GALLERY_PREVIOUS_HREF##', ' href="' + baseURL + '-nojs/' + (index - 1) + '.html"');
        }
      }

      if (index === config.length - 1) {
        galleryPageContents = galleryPageContents
          .replace('##GALLERY_NEXT_ACTIVE##', ' active')
          .replace('##GALLERY_NEXT_HREF##', '')
        ;
      }
      else {
        galleryPageContents = galleryPageContents
          .replace('##GALLERY_NEXT_ACTIVE##', '')
          .replace('##GALLERY_NEXT_HREF##', ' href="' + baseURL + '-nojs/' + (index + 1) + '.html"')
        ;
      }

      if (index === 0) {
        result = galleryPageContents;
      }
      else {
        grunt.file.write(distributionDirectory + baseURL + '-nojs/' + index + '.html',
          stripDevLinks(galleryPageContents.replace('<head>', '<head><link rel="canonical" href="' + baseURL + '">'), production),
          fileOptions
        );
      }
    });

    return result;
  }

  /**
   * Convert a name to a proper URL.
   *
   * @param name string
   *   The name to convert.
   * @return string
   *   The converted name.
   */
  function nameToURL(name) {
    return name.toLowerCase().replace(' ', '-').replace('/', '-');
  }

  /**
   * Strips development file endings from link targets to ensure clean URLs.
   *
   * @param source string
   *   The source HTML to process.
   * @param production boolean
   *   Determines if the routes are cleaned up or not.
   * @return string
   *   The HTML with clean link targets.
   */
  function stripDevLinks(source, production) {
    if (production !== true) {
      return source;
    }

    return source.replace(/(<a.*href=".*)(\.html)(.*>)/g, '$1$3');
  }


  // ------------------------------------------------------------------------------------------------------------------- Task registry


  // Load all external tasks at once.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

  // Add Vimeo API calls to the downloadfile config dynamically.
  grunt.registerTask('addVideoDownloadConfig', 'add video download configuration', function () {
    var downloadConfig = grunt.config.get('downloadfile.files');
    grunt.file.readJSON('media/video/videos.json').forEach(function (element, index) {
      downloadConfig.push({
        dest: 'media/video/api',
        name: index + '.json',
        url:  'http://vimeo.com/api/v2/video/' + element + '.json'
      });
    });
    grunt.config.set('downloadfile.files', downloadConfig);
  });

  // Replace downloadfile config completely with video thumbnails for second run.
  grunt.registerTask('addVideoThumbnailDownloadConfig', 'add video download configuration', function () {
    var files = grunt.file.expand({ filter: 'isFile' }, 'media/video/api/*.json');
    var downloadConfig = [];
    var videoGalleryConfig = [];
    files.forEach(function (path, index) {
      var videoConfig = grunt.file.readJSON(path, { encoding: 'utf-8' });
      downloadConfig.push({
        dest: 'media/video/thumbs',
        name: index + '.jpg',
        url:  videoConfig[0].thumbnail_large
      });
      videoGalleryConfig.push({
        alt:      videoConfig[0].title,
        id:       index,
        preview:  'https://player.vimeo.com/video/' + videoConfig[0].id,
        url:      'https://player.vimeo.com/video/' + videoConfig[0].id,
        thumb:    '/assets/img/media/video/thumbs/' + index + '.jpg'
      });
    });

    grunt.config.set('downloadfile.files', downloadConfig);
    grunt.file.write('media/video/config/config.json', JSON.stringify(videoGalleryConfig),{ encoding: 'utf-8' });
  });

  // Compile bootstrap CSS and copy it to the output directory.
  grunt.registerTask('css-bootstrap', [ 'copy:bootstrap', 'copy:bootstrapConfig', 'less' ]);

  // Compile bootstrap CSS, copy all CSS to the output directory, prefix and prettify CSS.
  grunt.registerTask('css-dev', [ 'csslint:css', 'css-bootstrap', 'concat:css', 'autoprefixer:dist', 'csscomb:dist' ]);

  // Compile bootstrap CSS, copy all CSS to the output directory, prefix and minify CSS.
  grunt.registerTask('css-prod', [ 'css-dev', 'cssmin', 'clean:prodCSS' ]);

  // The default task.
  grunt.registerTask('default', [ 'deploy-prod' ]);

  // Download all external dependencies.
  grunt.registerTask('dependencies', [ 'addVideoDownloadConfig', 'downloadfile', 'addVideoThumbnailDownloadConfig', 'downloadfile' ]);

  // Deploy in development mode.
  grunt.registerTask('deploy-dev', [ 'deploy-local-dev', 'ftp-deploy:easyname' ]);

  // Deploy locally in development mode without uploading anything.
  grunt.registerTask('deploy-local-dev', [ 'clean:dist', 'dependencies', 'css-dev', 'js-dev', 'images', 'html-dev', 'copy:font', 'copy:apache', 'clean:temp' ]);

  // Deploy locally in production mode without uploading anything.
  grunt.registerTask('deploy-local-prod', [ 'clean:dist', 'dependencies', 'css-prod', 'js-prod', 'images', 'html-prod', 'copy:font', 'copy:apache', 'clean:temp' ]);

  // Deploy in production mode.
  grunt.registerTask('deploy-prod', [ 'deploy-local-prod', 'ftp-deploy:easyname' ]);

  // Build HTML, validate and prettify it.
  grunt.registerTask('html-dev', [ 'ftmsHTML:development', 'validation', 'prettify' ]);

  // Build HTML, validate and minify it.
  grunt.registerTask('html-prod', [ 'ftmsHTML', 'validation', 'htmlmin' ]);

  grunt.registerTask('images', [ 'copy:img', 'copy:gallery', 'image_resize', 'imagemin' ]);

  // Copy all JS to the output directory.
  grunt.registerTask('js-dev', [ 'jshint:js', 'concat:jsTop', 'concat:jsBottom' ]);

  // Copy all JS to the output directory and uglify it.
  grunt.registerTask('js-prod', [ 'js-dev', 'uglify', 'clean:prodJS' ]);

  // Custom task: Construct HTML output and move it to the output directory.
  grunt.registerTask('ftmsHTML', 'HTML construction task.', function (mode){
    var production = true;
    if (mode === 'development') {
      production = false;
    }

    if (production !== true) {
      grunt.log.error('Building HTML in development mode.');
    }

    // Options for reading and writing files.
    var fileOptions = { encoding: 'utf-8' };

    // Retrieve the template, header and footer (only once!).
    var template  = grunt.file.read('config/html/template.html', fileOptions);
    var header    = grunt.file.read('config/html/header.html', fileOptions);
    var footer    = grunt.file.read('config/html/footer.html', fileOptions);

    // Various directories for later reference.
    var contentDirectory      = 'content/';
    var distributionDirectory = 'dist/';
    var assetsDirectory       = distributionDirectory + 'assets/';
    var cssDirectory          = assetsDirectory + 'css/';
    var jsDirectory           = assetsDirectory + 'js/';

    // All files in the content directory, globbed by grunt.
    var files = grunt.file.expand({ cwd: contentDirectory, filter: 'isFile' }, '**/*.html');

    // The hierarchical menu structure for easier menu building.
    var menuTree  = {};

    // Replacement pattern for file/folder prefixes.
    var filePrefix = /[0-9]*_/;

    // Build the menu tree for easier processing.
    files.forEach(function (element) {
      var path = element.split('/');
      // Add primary level of navigation elements.
      if (menuTree.hasOwnProperty(path[0]) === false) {
        menuTree[path[0]] = {
          name:     path[0].replace(filePrefix, '').replace('.html', ''),
          children: false
        };
        // Initialize a children object if the current element is a directory.
        if (grunt.file.isDir(contentDirectory, path[0])) {
          menuTree[path[0]].children = {};
        }
      }
      // Add secondary level of navigation elements.
      if (path.length > 1) {
        if (menuTree[path[0]].hasOwnProperty(path[1]) === false) {
          menuTree[path[0]].children[path[1]] = {
            name: path[1].replace(filePrefix, '').replace('.html', ''),
            path: element
          };
        }
      }
    });

    var galleryConfig = [];
    grunt.file.expand({ cwd: 'media/gallery', filter: 'isFile' }, '**/*.{svg,jpg,png,gif}').forEach(function (element, index) {
      galleryConfig.push({
        alt:      '4000 mile stare story shot ' + (index + 1),
        id:       index,
        preview:  '/assets/img/media/gallery/previews/' + element,
        url:      '/assets/img/media/gallery/' + element,
        thumb:    '/assets/img/media/gallery/thumbs/' + element
      });
    });

    var videoGalleryConfig = grunt.file.readJSON('media/video/config/config.json', fileOptions);

    // Build and concatenate the HTML files from the templates.
    for (var firstLevel in menuTree) {
      var fileContents = '';
      // Filter properties possibly inherited from the prototype.
      if (menuTree.hasOwnProperty(firstLevel)) {
        // We have a first level page.
        if (menuTree[firstLevel].children === false) {
          fileContents = template;
          fileContents = insertPageContent(
            fileContents,
            menuTree[firstLevel].name,
            grunt.file.read(contentDirectory + firstLevel, fileOptions)
          );
          fileContents = insertHeader(fileContents, header);
          fileContents = insertFooter(
            fileContents,
            firstLevel,
            footer,
            menuTree.footer.children,
            production
          );
          fileContents = insertMenu(fileContents, menuTree, firstLevel, production);
          fileContents = insertCSS(fileContents, menuTree[firstLevel].name, cssDirectory, production);
          fileContents = insertJS(fileContents, menuTree[firstLevel].name, jsDirectory, production);

          // Write the file contents to the respective output file.
          grunt.file.write(
            distributionDirectory + nameToURL(menuTree[firstLevel].name) + '.html',
            stripDevLinks(fileContents, production),
            fileOptions
          );
        }
        else {
          // Iterate over all second level pages and to the substitutions.
          for (var secondLevel in menuTree[firstLevel].children) {
            fileContents = template;
            if (menuTree[firstLevel].children.hasOwnProperty(secondLevel)) {
              fileContents = insertPageContent(
                fileContents,
                menuTree[firstLevel].name + '/' + menuTree[firstLevel].children[secondLevel].name,
                grunt.file.read(contentDirectory + menuTree[firstLevel].children[secondLevel].path, fileOptions)
              );
              fileContents = insertHeader(fileContents, header);
              fileContents = insertFooter(
                fileContents,
                secondLevel,
                footer,
                menuTree.footer.children,
                production
              );
              fileContents = insertMenu(fileContents, menuTree, secondLevel, production);
              fileContents = insertCSS(fileContents, menuTree[firstLevel].children[secondLevel].name, cssDirectory, production);
              fileContents = insertJS(fileContents, menuTree[firstLevel].children[secondLevel].name, jsDirectory, production);

              if (menuTree[firstLevel].name.toLowerCase() === 'media') {
                var galleryTemplate = fileContents;
                if (menuTree[firstLevel].children[secondLevel].name.toLowerCase() === 'gallery') {
                  fileContents = makeGallery(galleryTemplate, galleryConfig, distributionDirectory, '/media/gallery', fileOptions, production);
                }
                else if (menuTree[firstLevel].children[secondLevel].name.toLowerCase() === 'video') {
                  fileContents = makeGallery(galleryTemplate, videoGalleryConfig, distributionDirectory, '/media/video', fileOptions, production);
                }
              }

              var path = distributionDirectory;
              // Write footer pages on the first level.
              if (firstLevel !== 'footer') {
                path +=  nameToURL(menuTree[firstLevel].name) + '/';
              }
              path += nameToURL(menuTree[firstLevel].children[secondLevel].name) + '.html';
              // Write the file contents to the respective output file.
              grunt.file.write(path, stripDevLinks(fileContents, production), fileOptions);
            }
          }
        }
      }
    }
  });

};
