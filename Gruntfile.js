module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        env: grunt.file.readJSON('config.json'),

        // concat: {

        //     options: {
        //         separator: ';',
        //     },

        //     desktop: {
        //         src: [

        //             './build/js/lib.js',
        //             './build/js/components/**/*.js',

        //             './build/js/main.js'

        //         ],
        //         dest: './content/themes/kim/assets/js/scripts.js',
        //     },

        // },

        // uglify: {
        //     options: {
        //         banner: '/*\n' +
        //             ' * <%= pkg.name %>\n' +
        //             ' */\n',
        //         mangle: false,
        //         compress: false
        //     },
        //     js: {
        //         files: {
        //             './content/themes/kim/assets/js/scripts.min.js': [
        //                 './content/themes/kim/assets/js/scripts.js'
        //             ]
        //         }
        //     }
        // },

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

        rsync: {
            options: {
                args: [
                    "-avhzS --progress"
                ],
                exclude: [
                    ".DS_Store",
                    ".git*",
                    "*.scss",
                    "node_modules",
                    "bower_components"
                ],
                recursive: true
            },
            deploy: {
                options: {
                    src: '<%= env.rsync.deploy.src %>',
                    dest: '<%= env.rsync.deploy.dest %>',
                    host: '<%= env.rsync.deploy.host %>',
                    delete: false
                }
            },
        },

        watch: {
            css: {
                files: './build/scss/**/*.scss',
                tasks: [
                    'sass:build'
                ]
            }
            // js: {
            //     files: './build/js/**/*.js',
            //     tasks: [
            //         'js'
            //     ]
            // },
        }

    });

    grunt.registerTask('default', []);

    // grunt.registerTask('js', [
    //     'concat',
    //     'uglify'
    // ]);

    grunt.registerTask('build', [
        'sass:build',
        'copy:build'
    ]);

    grunt.registerTask('dist', [
        'clean:dist',
        'sass:dist',
        'copy:dist'
    ]);

    grunt.registerTask('deploy', [
        'dist',
        'rsync:deploy'
    ]);

    grunt.registerTask('stage', [
        'rsync:stage'
    ]);

};