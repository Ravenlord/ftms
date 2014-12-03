module.exports = function(grunt) {


  // ------------------------------------------------------------------------------------------------------------------- Imports


  var fs = require('fs');


  // ------------------------------------------------------------------------------------------------------------------- Configuration


  grunt.initConfig({
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
      css: {
        dest:   'dist/',
        src:    'assets/css/*.css'
      }
    },
    clean: {
      dist: [ 'dist/' ],
      temp: [ 'dist/temp/' ]
    },
    cssmin: {
      dist: {
        expand:              true,
        ext:                 '.min.css',
        keepSpecialComments: 0,
        src:                 'dist/assets/css/*.css'
      }
    },
    less: {
      bootstrap: {
        dest: 'dist/assets/css/bootstrap.css',
        options: {
          strictMath:       true
        },
        src:  'dist/temp/bootstrap/bootstrap.less'
      }
    }
  });


  // ------------------------------------------------------------------------------------------------------------------- External tasks


  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');


  // ------------------------------------------------------------------------------------------------------------------- Task registry


  // A very basic default task.
  grunt.registerTask('default', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

  grunt.registerTask('bootstrap', [ 'copy:bootstrap', 'copy:bootstrapConfig', 'less', 'clean:temp' ]);

  grunt.registerTask('css', [ 'copy:css', 'bootstrap', 'cssmin' ])

};
