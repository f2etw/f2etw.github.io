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
					src: ['**/*.md', '!README.md', '!node_modules/**/*', '!_*/**/*', '!src/**/*'],
					dest: 'src/'
				}]
			},
			sass: {
				src: '_sass/*',
				dest: 'src/',
			},
			activities: {
				expand: true,
				cwd: '_activities/',
				src: '**',
				dest: 'src/activities/'
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
		},
		'string-replace': {
			dist: {
				files: [{
					expand: true,
					src: 'build/**/*.html',
					dest: './',
				}],
				options: {
					replacements: [{
						pattern: / id="-"/g,
						replacement: ' id="section"'
					}]
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-metalsmith');
	grunt.loadNpmTasks('grunt-matter');
	grunt.loadNpmTasks('grunt-string-replace');

	grunt.registerTask('default', ['copy', 'matter', 'metalsmith', 'string-replace', 'connect', 'watch']);
	grunt.registerTask('build', ['copy', 'matter', 'metalsmith', 'string-replace']);
};
