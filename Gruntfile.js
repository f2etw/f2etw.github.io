module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			livereload: {
				files: ['**/*.md', '**/*.html', '**/*.scss', '!node_modules/**/*', '!build/**/*', '!_site/**/*', '!export/**/*'],
				tasks: ['copy', 'matter', 'metalsmith'],
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
		},
		matter: {
			style: {
				options: {
					strip: true
				},
				files: [{
					src: ['style.scss'],
					dest: 'src/style.scss'
				}]
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-metalsmith');
	grunt.loadNpmTasks('grunt-matter');

	grunt.registerTask('default', ['copy', 'matter', 'metalsmith', 'connect', 'watch']);
	grunt.registerTask('build', ['copy', 'matter', 'metalsmith']);
};
