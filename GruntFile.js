var path = require("path");

var targetDir = "target";
var targetMainDir = path.join(targetDir, "main");
var targetTestDir = path.join(targetDir, "test");

module.exports = function(grunt) {
    require("jit-grunt")(grunt, {
        eslint: "eslint-grunt"
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
                config: "eslintrc.json"
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
        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    quiet: false,
                    clearRequireCache: true
                },
                src: [path.join(targetTestDir, "**/*.js")]
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
                src: path.join(targetMainDir, "main.js"),
                options: {
                    cwd: targetMainDir
                }
            }
        }
    });

    grunt.registerTask("build", ["eslint:server", "babel:server"]);
    grunt.registerTask("run", ["build", "env:server", "execute:server"]);
    grunt.registerTask("test", ["build", "eslint:test", "babel:test", "env:server", "mochaTest:test"]);

    grunt.registerTask("default", ["test"]);
};
