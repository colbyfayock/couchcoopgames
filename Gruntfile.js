module.exports = function(grunt) {

    require('jit-grunt')(grunt, {
        cloudfront: 'grunt-aws'
    });

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readJSON('config.json'),

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

        aws_s3: {

            options: {
                accessKeyId: '<%= config.aws.accessKeyId %>',
                secretAccessKey: '<%= config.aws.secretAccessKey %>',
                bucket: 'couchcoopgames.com',
                region: 'us-east-1',
                differential: true,
                uploadConcurrency: 5,
                downloadConcurrency: 5
            },
            
            default: {
                files: [
                    {
                        expand: true,
                        cwd: './dist',
                        src: ['**'],
                        dest: '/'
                    }
                ]
            },

        },

        cloudfront: {
            options: {
                accessKeyId: '<%= config.aws.accessKeyId %>',
                secretAccessKey: '<%= config.aws.secretAccessKey %>',
                distributionId: '<%= config.aws.cloudfrontDistributionId %>'
            },
            deafult: {}
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

    // Pulls in the changed files from aws_s3 at run time and pass them
    // into cloudfront invalidation

    grunt.registerTask('invalidate_cache', 'Invalidate Cloudfront from aws_s3 output', function (subtask) {

        var aws_changed = grunt.config.get('aws_s3_changed'),
            task = 'cloudfront',
            changed_files;

        if ( !Array.isArray(aws_changed) ) {
            console.log('Changed files is not an array');
            return;
        }

        changed_files = aws_changed.map(function(file) {
            return '/' + file;
        });

        if ( subtask ) {
            task = task + ':' + subtask;
        }

        grunt.config.set('cloudfront.options.invalidations', changed_files);

        if ( !Array.isArray(changed_files) || changed_files.length === 0 ) {
            console.log('No files changed');
            return;
        }

        grunt.task.run(task);

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

    grunt.registerTask('deploy', [
        'dist',
        'aws_s3',
        'invalidate_cache'
    ]);

};