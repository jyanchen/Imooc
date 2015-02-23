module.exports = function(grunt) {

	grunt.initConfig({
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
			}
		},
		nodemon: {
			dev: {
				script:"app.js",
				options: {
					args: [],
					ingoredFiles: ["README.md", "node_modules/**", ".DS_Store"],
					watchedExtendsions: ["js"],
					watchedFolders: ["./"],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},
		concurrent: {
			tasks: ["nodemon", "watch"], 
			options: {
				logConcurrentOutput: true
			}
		}
	})

	grunt.loadNpmTasks("grunt-contrib-watch") // 监测正在运行的node项目文件的变化
	grunt.loadNpmTasks("grunt-nodemon") // 实时监听node的入口文件，即app.js
	grunt.loadNpmTasks("grunt-concurrent") // 慢任务，sass、less的编译任务

	grunt.option("force", true) // 忽略一些语法性的错误而导致任务终止
	grunt.registerTask("default", ["concurrent"]) // 默认任务
}