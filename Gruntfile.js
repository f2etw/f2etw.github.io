module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			livereload: {
				files: ['**/*.md', '**/*.html', '!node_modules/**/*', '!build/**/*', '!_site/**/*'],
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
		clean: ['src'],
		copy: {
			main: {
				files: [{
					expand: true,
					src: ['**/*.md', '!node_modules/**/*', '!_sites/**/*', '!src/**/*'],
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
			}
		},
		metalsmith: {
			main: {
				options: {
				  "plugins": {
					"metalsmith-markdown": {},
					"metalsmith-sass": {
					  "outputStyle": "expanded"
					},
					"metalsmith-templates": {
					  "engine": "swig",
					  "directory": "_layouts",
					  "default": "default.html",
					  "pattern": ["!*.css"]
					}
				  }
				},
				src: 'src',
				dest: 'build'
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-metalsmith');

	grunt.registerTask('default', ['clean', 'copy', 'metalsmith', 'connect', 'watch']);
	grunt.registerTask('build', ['clean', 'copy', 'metalsmith']);
};
