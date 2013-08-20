'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'dist/*',
            '!dist/.git*'
          ]
        }]
      }
    },
    coffee: {
      dev: {
        options: {
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: 'src/directive',
          src: '{,*/}*.coffee',
          dest: 'src/directive',
          ext: '.js'
        }]
      }
    },
    concat: {
      src: {
        src: ['src/directive/file_dropzone.js'],
        dest: 'dist/angular-file-dnd.js'
      }
    },
    ngmin: {
      src: {
        src: '<%= concat.src.dest %>',
        dest: '<%= concat.src.dest %>'
      }
    },
    uglify: {
      src: {
        files: {
          'dist/angular-file-dnd.min.js': '<%= concat.src.dest %>'
        }
      }
    }
  });


  grunt.registerTask('build', [
    'dev',
    'clean:dist',
    'ngmin',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('dev', [
    'coffee:dev'
  ]);

  grunt.registerTask('default', ['build']);
};