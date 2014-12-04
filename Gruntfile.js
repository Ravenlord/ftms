module.exports = function(grunt) {


  // ------------------------------------------------------------------------------------------------------------------- Imports


  var fs = require('fs');


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
        src:    'assets/css/*.css'
      },
      img: {
        dest:   'dist/',
        src:    'assets/img/*'
      },
      js: {
        dest:   'dist/',
        src:    'assets/js/*.js'
      }
    },

    // Delete directories.
    clean: {
      dist: [ 'dist/' ],
      temp: [ 'dist/temp/' ]
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

    // Minify CSS.
    cssmin: {
      dist: {
        expand:              true,
        ext:                 '.min.css',
        keepSpecialComments: 0,
        src:                 'dist/assets/css/*.css'
      }
    },

    // Custom HTML construction task.
    ftmsHTML: {
      dist: {
        cwd:      'content/',
        dest:     'dist/',
        expand:   true,
        footer:   'config/html/footer.html',
        header:   'config/html/header.html',
        // Let Grunt glob everything.
        src:      '**/*.html',
        template: 'config/html/template.html'
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
    }
  });


  // ------------------------------------------------------------------------------------------------------------------- Task registry


  // Load all external tasks at once.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

  // Compile bootstrap CSS and copy it to the output directory.
  grunt.registerTask('css-bootstrap', [ 'copy:bootstrap', 'copy:bootstrapConfig', 'less', 'clean:temp' ]);

  // Compile bootstrap CSS, copy all CSS to the output directory and minify CSS.
  grunt.registerTask('css', [ 'copy:css', 'css-bootstrap', 'autoprefixer:dist', 'csscomb:dist', 'cssmin' ])

  // Copy all JS to the output directory and uglify it. TODO: Add uglify task.
  grunt.registerTask('js', [ 'copy:js', 'uglify', 'copy:bootstrapJs' ]);

  // Custom task: Construct HTML output and move it to the output directory.
  grunt.registerMultiTask('ftmsHTML', 'HTML construction task.', function (){
    // TODO: Set to true if page is ready for final deployment.
    var production = false;

    if (production !== true) {
      grunt.log.error('Building HTML in development mode.');
    }

    // Retrieve the template, header and footer (only once!).
    var template  = fs.readFileSync(this.files[0].template, 'utf-8');
    var header    = fs.readFileSync(this.files[0].header, 'utf-8');
    var footer    = fs.readFileSync(this.files[0].footer, 'utf-8');

    var menuTree  = {}

    this.files.forEach(function(filePair) {
      filePair.src.forEach(function(src){
        var path = src.replace(filePair.orig.cwd, '').replace('.html', '').split('/')
        if (menuTree.hasOwnProperty(path[0]) === false) {
          menuTree[path[0]] = [];
        }
        if (path.length > 1) {
          menuTree[path[0]].push(path[1]);
        }
      });
    });

    // TODO: Build HTML menu + set current page active!
    console.dir(menuTree);

    //TODO: Concatenate files, include CSS (also for specific page if present) and JS according to production flag.
  });

};
