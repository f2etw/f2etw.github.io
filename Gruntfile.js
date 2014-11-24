module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			livereload: {
				files: ['**/*.md', '**/*.html', '!node_modules/**/*'],
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
					src: ['**/*.md', '**/*.scss', '!node_modules/**/*', '!_sites/**/*', '!src/**/*'],
					dest: 'src/'
				}]
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
					  "directory": "src/_layouts",
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
	grunt.loadNpmTasks('grunt-metalsmith');

	grunt.registerTask('default', ['copy', 'metalsmith', 'connect', 'watch']);
};
