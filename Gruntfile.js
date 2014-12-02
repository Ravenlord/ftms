module.exports = function(grunt) {


  // ------------------------------------------------------------------------------------------------------------------- Imports


  var fs = require('fs');


  // ------------------------------------------------------------------------------------------------------------------- Configuration


  grunt.initConfig({
    cssmin: {
      my_target: {
        files: [{
           expand: true,
           src: 'assets/css/*.css',
           dest: 'dist/',
           ext: '.css',
           keepSpecialComments: 0
        }]
      }
    }
  });


  // ------------------------------------------------------------------------------------------------------------------- External tasks


  grunt.loadNpmTasks('grunt-contrib-cssmin');


  // ------------------------------------------------------------------------------------------------------------------- Task registry


  // A very basic default task.
  grunt.registerTask('default', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

};
