var path = require("path");

var targetDir = "target";
var targetMainDir = path.join(targetDir, "main");
var targetTestDir = path.join(targetDir, "test");

module.exports = function(grunt) {
    require("jit-grunt")(grunt, {
        mochacli: 'grunt-mocha-cli'
    });
    require("time-grunt")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            build: {
                src: targetDir
            }
        },
        eslint: {
            options: {
                configFile: "eslintrc.json"
            },
            server: {
                files: [{
                    expand: true,
                    cwd: "src/server/main",
                    src: ["**/*.js"]
                }]
            },
            test: {
                options: {
                    envs: ["mocha"]
                },
                files: [{
                    expand: true,
                    cwd: "src/server/test",
                    src: ["**/*.js"]
                }]
            }
        },
        env: {
            server: {
                NODE_PATH: targetMainDir
            }
        },
        babel: {
            options: {
                sourceMap: true,
                optional: "runtime"
            },
            server: {
                files: [{
                    expand: true,
                    cwd: "src/server/main",
                    src: ["**/*.js"],
                    dest: targetMainDir
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: "src/server/test",
                    src: ["**/*.js"],
                    dest: targetTestDir
                }]
            }
        },
        mocha_istanbul: {
            test: {
                src: targetTestDir,
                options: {
                    coverageFolder: path.join(targetDir, "coverage")
                }
            }
        },
        watch: {
            test: {
                files: [
                    "package.json",
                    "GruntFile.json",
                    "src/server/main/**/*.js",
                    "src/server/test/**/*.js",
                ],
                tasks: ['test'],
                options: {
                    spawn: true,
                    interrupt: false,
                    reload: false,
                    atBegin: true
                }
            }
        },
        execute: {
            server: {
                src: path.join(targetMainDir, "main.js")
            }
        }
    });

    grunt.registerTask("build", ["eslint:server", "babel:server"]);
    grunt.registerTask("run", ["build", "env:server", "execute:server"]);
    grunt.registerTask("test", ["build", "eslint:test", "babel:test", "env:server", "mocha_istanbul:test"]);

    grunt.registerTask("default", ["test"]);
};
