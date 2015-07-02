var path = require('path');

var targetDir = 'target';

module.exports = function(grunt) {
    require('jit-grunt')(grunt, {
    });
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: targetDir
            }
        }
    });

    grunt.registerTask('build', []);
    grunt.registerTask('run', ['build']);
    grunt.registerTask('test', ['build']);

    grunt.registerTask('default', ['test']);
};
