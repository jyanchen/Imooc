module.exports = function(grunt) {

    grunt.initConfig({
        // 读取配置文件（可选）
        pkg: grunt.file.readJSON('package.json'),
        // metadata
        meta: {
            basePath: '/',
            srcPath: 'public/dev/css',
            deployPath: 'public/css'
        },
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

        watch: { // 监听文件变化和刷新
            jade: {
                files: ["app/views/**"],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ["public/js/**", "models/**/*.js", "schemas/**/*.js"],
                // tasks: ["jshint"],
                options: {
                    livereload: true
                }
            },
            uglify: {
                files: ['public/dev/js/*.js'],
                tasks: ['uglify'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['<%= meta.srcPath %>/index.scss'],
                tasks: ['sass'],
                options: {
                    nospawn: true
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['public/libs/**/*.js']
            },
            all: ['public/dev/js/*.js', 'test/**/*.js', 'app/**/*.js']
        },

        // less: {
        //     development: {
        //         options: {
        //             compress: true,
        //             yuicompress: true,
        //             optimization: 2
        //         },
        //         files: {
        //             'public/build/index.css': 'public/css/index.less'
        //         }
        //     }
        // },

        sass: {
            dist: {
                files: {
                    '<%= meta.deployPath %>/index.css': '<%= meta.srcPath %>/index.scss'
                },
                options: {
                    sourcemap: false
                }
            }
        },

        uglify: {
            development: {
                // files: {
                //     'public/js/admin.min.js': 'public/dev/js/admin.js',
                //     'public/js/detail.min.js': ['public/dev/js/detail.js'],
                //     'public/js/index.min.js': ['public/dev/js/index.js'],
                //     'public/js/ua.min.js': ['public/dev/js/ua.js'],
                // }
                files: [{
                    expand: true,
                    cwd: 'public/dev/js',
                    src: '**/*.js',
                    dest: 'public/js'
                }],
                options: {
                    mangle: false,
                    beautify:true
                }
            }
        },
        nodemon: {
            dev: {
                script: "app.js",
                options: {
                    args: [],
                    ingoredFiles: ["README.md", "node_modules/**", ".DS_Store"],
                    watchedExtendsions: ["js"],
                    watchedFolders: ["./"],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 4000
                    },
                    cwd: __dirname
                }
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['./test/**/*.js']
        },
        // browserSync: {
        //     dev: {
        //         bsFiles: {
        //             src: [
        //                 'app/views/**'
        //             ] 
        //         },
        //         options: {
        //             watchTask: true,
        //             proxy: 'local.dev:4000',
        //         }
        //     }
        // },
        concurrent: {
            tasks: ["nodemon", "watch", "sass", "uglify"],
            // tasks: ["nodemon", "watch", "sass", "jshint", "uglify"],
            options: {
                logConcurrentOutput: true
            }
        }
    })

    grunt.loadNpmTasks("grunt-contrib-watch"); // 监测正在运行的node项目文件的变化
    grunt.loadNpmTasks("grunt-nodemon"); // 实时监听node的入口文件，即app.js
    grunt.loadNpmTasks("grunt-concurrent"); // 慢任务，sass、less的编译任务
    grunt.loadNpmTasks("grunt-contrib-sass");
    // grunt.loadNpmTasks('grunt-browser-sync'); // 同步测试移动端
    // grunt.loadNpmTasks("grunt-mocha-test"); // 测试框架
    // grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    // grunt.loadNpmTasks("grunt-contrib-less");

    grunt.option("force", true); // 忽略一些语法性的错误而导致任务终止
    grunt.registerTask("default", ["concurrent"]); // 默认任务
    grunt.registerTask("compress", ["uglify", "sass"]);
    // grunt.registerTask("test", ["mochaTest"]); // 测试
}
