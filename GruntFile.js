var path = require('path');

var targetDir = 'target';
var targetMainDir = path.join(targetDir, 'main');

module.exports = function(grunt) {
    require('jit-grunt')(grunt, {
        eslint: 'eslint-grunt'
    });
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: targetDir
            }
        },
        eslint: {
            options: {
                config: 'eslintrc.json'
            },
            server: [
                'src/server/main/**/*.js'
            ]
        },
        env: {
            server: {
                NODE_PATH: targetMainDir
            }
        },
        babel: {
            options: {
                sourceMap: true,
                optional: 'runtime'
            },
            server: {
                files: [{
                    expand: true,
                    cwd: 'src/server/main',
                    src: ['**/*.js'],
                    dest: targetMainDir
                }]
            }
        },
        execute: {
            server: {
                src: path.join(targetMainDir, 'main.js'),
                options: {
                    cwd: targetMainDir
                }
            }
        }
    });

    grunt.registerTask('build', ['eslint:server', 'babel:server']);
    grunt.registerTask('run', ['build', 'env:server', 'execute:server']);
    grunt.registerTask('test', ['build']);

    grunt.registerTask('default', ['test']);
};
