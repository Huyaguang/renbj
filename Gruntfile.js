'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        env: {
            dev: {
                NODE_ENV: 'development'
            },
            test: {
                NODE_ENV: 'test'
            },
            dist: {
                NODE_ENV: 'production'
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    ext: 'js,html',
                    watch: ['server.js', 'server/**/*.js']
                }
            },
            debug: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug'],
                    ext: 'js,html',
                    watch: ['server.js', 'server/**/*.js']
                }
            }
        },
        'node-inspector': {
            debug: {}
        },
        mochaTest: {
            src: 'server/tests/*.js',
            options: {
                reporter: 'spec'
            }
        },
        csslint: {
            all: {
                src: 'public/css/*.css'
            }
        },
        watch: {
            css: {
                files: ['public/css/*.css'],
                tasks: ['csslint']
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            },
            debug: {
                tasks: ['nodemon:debug', 'watch', 'node-inspector'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-node-inspector');

    grunt.registerTask('default', ['env:dev', 'lint', 'concurrent:dev']);
    grunt.registerTask('debug', ['env:dev', 'lint', 'concurrent:debug']);
    grunt.registerTask('test', ['env:test', 'mochaTest']);
    grunt.registerTask('lint', ['csslint']);
};
