module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			livereload: {
				files: ['**/*.md', '**/*.html', '**/*.scss', '!node_modules/**/*', '!build/**/*', '!_site/**/*'],
				tasks: ['copy', 'metalsmith'],
				options: {
					livereload: true
				}
			}
		},
		connect: {
			server: {
				options: {
					base: 'build',
					hostname: '*',
					livereload: true
				}
			}
		},
		copy: {
			main: {
				files: [{
					expand: true,
					src: ['**/*.md', '!README.md', '!node_modules/**/*', '!_sites/**/*', '!src/**/*'],
					dest: 'src/'
				}]
			},
			style: {
				src: 'style.scss',
				dest: 'src/style.scss',
				options: {
					process: function (content, srcpath) {
						return content.replace(/---\s.*\s---\s/, '');
					}
				}
			},
			sass: {
				src: '_sass/*',
				dest: 'src/',
			}
		},
		metalsmith: {
			main: {
				options: grunt.file.readJSON('metalsmith.json'),
				src: 'src',
				dest: 'build'
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-metalsmith');

	grunt.registerTask('default', ['copy', 'metalsmith', 'connect', 'watch']);
	grunt.registerTask('build', ['copy', 'metalsmith']);
};
