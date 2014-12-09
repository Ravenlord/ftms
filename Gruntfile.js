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

    // Concatenate source files and move them to the output directory.
    concat: {
      options: {
        stripBanners: { block: true, line: true}
      },
      css: {
        dest:   'dist/assets/css/main.css',
        src:    [ 'assets/css/base/general.css', 'assets/css/base/header-footer.css', 'assets/css/base/content.css' ]
      }
    },

    // Copy source files.
    copy: {
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
      bootstrapJs: {
        cwd:    'node_modules/bootstrap/dist/js/',
        dest:   'dist/assets/js/',
        expand: true,
        src:    [ '*.js', '!npm.js' ]
      },
      css: {
        dest:   'dist/',
        src:    'assets/css/modules/*.css'
      },
      js: {
        dest:   'dist/',
        src:    'assets/js/*.js'
      }
    },

    // Delete directories.
    clean: {
      dist:     [ 'dist/' ],
      prodCSS:  [ 'dist/*.css', '!dist/*.min.css' ],
      prodJS:  [ 'dist/*.js', '!dist/*.min.js' ],
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
      css: [ 'assets/css/**/*.css' ]
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
          dest:   'dist/',
          expand: true,
          src:    'assets/img/**/*.{png,jpg,gif,svg}'
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
        src:  'assets/js/**/*.js'
      }
    },

    // Compile less files.
    less: {
      bootstrap: {
        dest: 'dist/assets/css/bootstrap.css',
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
        src:  'assets/js/main.js'
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
      // Recompile bootstrap on less changes.
      bootstrap: {
        files:  'config/bootstrap/**/*.less',
        tasks:  [ 'css-bootstrap', 'autoprefixer:dist', 'csscomb:dist' ]
      },
      // Reprocess CSS files on changes.
      cssBase: {
        files:  'assets/css/base/**/*.css',
        tasks:  [ 'csslint:css', 'concat:css', 'autoprefixer:dist', 'csscomb:dist' ]
      },
      cssModules: {
        files:  'assets/css/modules/**/*.css',
        tasks:  [ 'csslint:css', 'copy:css', 'autoprefixer:dist', 'csscomb:dist' ]
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
        tasks:  'imagemin'
      },
      // Copy JS files on changes.
      js: {
        files:  'assets/js/**/*.js',
        tasks:  [ 'jshint:js', 'copy:js' ]
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
    // Bootstrap and main CSS files will always be included.
    var stylesheets = [ 'bootstrap', 'main' ];

    // Include stylesheet with the same name as page if it exists.
    if (grunt.file.isFile(cssDir, pageName.toLowerCase() + '.css')) {
      stylesheets.push(pageName);
    }

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
   * @param isIndex boolean
   *   Flag that determines if it's an index page or not.
   * @param footer string
   *   The footer template.
   * @param footerLinks object
   *   The footer links extracted from the menu tree.
   * @param production boolean
   *   Build the links in development or production format.
   * @return string
   *   The page with the inserted footer.
   */
  function insertFooter(source, file, isIndex, footer, footerLinks, production) {
    // Don't output the footer if it's an index page.
    if (isIndex === true) {
      return source.replace('##FOOTER##', '');
    }

    var html = source.replace('##FOOTER##', footer);
    var regex;
    for (var page in footerLinks) {
      // Add html suffix to footer links if we are in dev mode.
      if (production === false) {
        regex = new RegExp('(<a class=".*" href=".*)(">' + footerLinks[page].name + '</a>)');
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
   * @param isIndex boolean
   *   Flag that determines if it's an index page or not.
   * @param header string
   *   The header template.
   * @return string
   *   The page with the inserted header.
   */
  function insertHeader(source, isIndex, header) {
    // Don't output the header if it's an index page.
    return isIndex === true ? source.replace('##HEADER##', '') : source.replace('##HEADER##', header);
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
    // Bootstrap and main CSS files will always be included.
    var scripts = [ 'bootstrap', 'main' ];

    // Include script with the same name as page if it exists.
    if (grunt.file.isFile(jsDir, pageName.toLowerCase() + '.js')) {
      scripts.push(pageName);
    }

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
   * @param isIndex boolean
   *   Output different menu, if it's an index page.
   * @return string
   *   The source content with the menu.
   */
  function insertMenu(source, menuTree, file, production, isIndex) {
    var menu = '';
    if (isIndex === true) {
      return source;
    }

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
          // Set menu point active.
          if (firstLevel === file) {
            firstClassString += ' active';
            href = '#';
          }
          menu += '<a class="' + firstClassString + '" href="' + href + '">' + menuTree[firstLevel].name + '</a>';
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
              secondaryLinks += '<a class="' + secondClassString + '" href="' + href + '">'
                + menuTree[firstLevel].children[secondLevel].name + '</a>';
            }
          }
          // Secondary items processed, add the first level menu point.
          menu += '<div class="' + firstClassString + '">' + menuTree[firstLevel].name
            + '<div class="main-nav-second-wrapper">'
              + '<div class="hidden-xs main-nav-second-wrapper-nw"></div>'
              + '<div class="hidden-xs main-nav-second-wrapper-ne"></div>'
              + '<div class="hidden-xs main-nav-second-wrapper-sw"></div>'
              + '<div class="hidden-xs main-nav-second-wrapper-se"></div>'
              + secondaryLinks
              + '</div>'
            + '</div>'
          ;
        }
      }
    }

    return source.replace('##MENU##', menu);
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
   * @param isIndex boolean
   *   Flag determining if it's an index page or not.
   * @return string
   *   The page with page contents, title and page name inserted..
   */
  function insertPageContent(source, pageName, content, isIndex) {
    // Replace page content.
    var html = source.replace(
      '##CONTENT##',
      content
    );

    // Just delete title if it's the index page.
    if (isIndex === true) {
      html = html.replace('##TITLE##', '');
    }
    // Replace it properly otherwise.
    else {
      html = html.replace('##TITLE##', pageName.toUpperCase() + ' — ');
    }

    // Replace the page name.
    html = html.replace('##PAGENAME##', nameToURL(pageName));

    return html;
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


  // ------------------------------------------------------------------------------------------------------------------- Task registry


  // Load all external tasks at once.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

  // Compile bootstrap CSS and copy it to the output directory.
  grunt.registerTask('css-bootstrap', [ 'copy:bootstrap', 'copy:bootstrapConfig', 'less', 'clean:temp' ]);

  // Compile bootstrap CSS, copy all CSS to the output directory, prefix and prettify CSS.
  grunt.registerTask('css-dev', [ 'csslint:css', 'concat:css', 'copy:css', 'css-bootstrap', 'autoprefixer:dist', 'csscomb:dist' ]);

  // Compile bootstrap CSS, copy all CSS to the output directory, prefix and minify CSS.
  grunt.registerTask('css-prod', [ 'css-dev', 'cssmin', 'clean:prodCSS' ]);

  // Build HTML, validate and prettify it.
  grunt.registerTask('html-dev', [ 'ftmsHTML', 'validation', 'prettify' ]);

  // Build HTML, validate and minify it.
  grunt.registerTask('html-prod', [ 'ftmsHTML', 'validation', 'htmlmin' ]);

  // Copy all JS to the output directory.
  grunt.registerTask('js-dev', [ 'jshint:js', 'copy:js', 'copy:bootstrapJs' ]);

  // Copy all JS to the output directory and uglify it.
  grunt.registerTask('js-prod', [ 'js-dev', 'uglify', 'clean:prodJS' ]);

  // TODO: Add task for Apache config.

  // Custom task: Construct HTML output and move it to the output directory.
  grunt.registerTask('ftmsHTML', 'HTML construction task.', function (){
    // TODO: Set to true if page is ready for final deployment.
    var production = false;

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

    // Build and concatenate the HTML files from the templates.
    for (var firstLevel in menuTree) {
      var fileContents = '';
      // Filter properties possibly inherited from the prototype.
      if (menuTree.hasOwnProperty(firstLevel)) {
        // We have a first level page.
        if (menuTree[firstLevel].children === false) {
          fileContents = template;
          // Determine if it's the index page.
          var isIndex = firstLevel === 'index.html';
          fileContents = insertPageContent(
            fileContents,
            menuTree[firstLevel].name,
            grunt.file.read(contentDirectory + firstLevel, fileOptions),
            isIndex
          );
          fileContents = insertHeader(fileContents, isIndex, header);
          fileContents = insertFooter(
            fileContents,
            firstLevel,
            isIndex,
            footer,
            menuTree.footer.children,
            production
          );
          fileContents = insertMenu(fileContents, menuTree, firstLevel, production, isIndex);
          fileContents = insertCSS(fileContents, menuTree[firstLevel].name, cssDirectory, production);
          fileContents = insertJS(fileContents, menuTree[firstLevel].name, jsDirectory, production);

          // Write the file contents to the respective output file.
          grunt.file.write(
            distributionDirectory + nameToURL(menuTree[firstLevel].name) + '.html',
            fileContents,
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
                grunt.file.read(contentDirectory + menuTree[firstLevel].children[secondLevel].path, fileOptions),
                false
              );
              fileContents = insertHeader(fileContents, false, header);
              fileContents = insertFooter(
                fileContents,
                secondLevel,
                false,
                footer,
                menuTree.footer.children,
                production
              );
              fileContents = insertMenu(fileContents, menuTree, secondLevel, production, false);
              fileContents = insertCSS(fileContents, menuTree[firstLevel].children[secondLevel].name, cssDirectory, production);
              fileContents = insertJS(fileContents, menuTree[firstLevel].children[secondLevel].name, jsDirectory, production);

              var path = distributionDirectory;
              // Write footer pages on the first level.
              if (firstLevel !== 'footer') {
                path +=  nameToURL(menuTree[firstLevel].name) + '/';
              }
              path += nameToURL(menuTree[firstLevel].children[secondLevel].name) + '.html';
              // Write the file contents to the respective output file.
              grunt.file.write(path, fileContents, fileOptions);
            }
          }
        }
      }
    }
  });

};
