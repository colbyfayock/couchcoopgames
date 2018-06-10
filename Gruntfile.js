module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {

            build: {
                options: {
                    sourceMap: true,
                    outputStyle: 'expanded'
                },
                files: {
                    './assets/css/ccg.css': './build/scss/main.scss',
                }
            },

            dist: {
                options: {
                    sourceMap: false,
                    outputStyle: 'compressed'
                },
                files: {
                    './dist/assets/css/ccg.css': './build/scss/main.scss',
                }
            }

        },

        clean: {
            dist: [
                './dist'
            ]
        },

        copy: {

            build: {
                files: [
                    {
                        expand: true,
                        src: [
                            './bower_components/fontawesome/fonts/*'
                        ],
                        dest: './assets/fonts',
                        flatten: true,
                        filter: 'isFile'
                    }
                ],
            },

            dist: {
                files: [
                    {
                        expand: true,
                        src: [
                            './index.html',
                            './browserconfig.xml',
                            './favicon.ico',
                            './manifest.json'
                        ],
                        dest: './dist',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        src: [
                            './bower_components/fontawesome/fonts/*'
                        ],
                        dest: './dist/assets/fonts/',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        src: [
                            './assets/images/*'
                        ],
                        dest: './dist/assets/images/',
                        flatten: true,
                        filter: 'isFile'
                    }
                ],
            }

        },

        watch: {
            css: {
                files: './build/scss/**/*.scss',
                tasks: [
                    'sass:build'
                ]
            }
        }

    });

    grunt.registerTask('build', [
        'sass:build',
        'copy:build'
    ]);

    grunt.registerTask('dist', [
        'clean:dist',
        'sass:dist',
        'copy:dist'
    ]);

};