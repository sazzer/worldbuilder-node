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
        copy: {
            schema: {
                files: [
                    {
                        expand: true,
                        cwd: "src/server/schema",
                        src: "**/*",
                        dest: path.join(targetMainDir, "schema")
                    }
                ]
            }
        },
        eslint: {
            options: {
                configFile: ".eslintrc"
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
                src: path.join(targetTestDir, "**", "*.spec.js"),
                options: {
                    require: [
                        path.join(targetTestDir, "setup.js"),
                    ],
                    mochaOptions: [
                        "--growl"
                    ],
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
        notify: {
            running: {
                options: {
                    message: "Server is running"
                }
            }
        },
        execute: {
            server: {
                src: path.join(targetMainDir, "main.js")
            }
        }
    });

    grunt.registerTask("build", ["eslint:server", "babel:server", "copy:schema"]);
    grunt.registerTask("run", ["build", "env:server", "notify:running", "execute:server"]);
    grunt.registerTask("test", ["build", "eslint:test", "babel:test", "env:server", "mocha_istanbul:test"]);

    grunt.registerTask("default", ["test"]);
};
