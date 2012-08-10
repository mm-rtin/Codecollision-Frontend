/*global module:false*/
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-less');

	// Project configuration.
	grunt.initConfig({
		meta: {
			version: '0.1.0',
			banner: '/*! CODECOLLISION - v<%= meta.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* http://www.codecollision.net/\n' +
				'* <%= grunt.template.today("yyyy") %> - ' +
				'Michael Martin */'
		},

		// source files
		src: {
			js: [

				// libraries
				'lib/structure.min.js',
				'lib/underscore.min.js',
				'lib/jquery.history.min.js',
				'lib/jquery.backstretch.min.js',
				'lib/jquery.foundation.orbit.js',

				// codecollision source (order matters)
				'js/codecollision.js',
				'js/util/history.js',
				'js/util/utilities.js',
				'js/util/prefetch.js',
				'js/posts/post_model.js',
				'js/posts/post_view.js',
				'js/init.js'
			],
			less: [
				'less/*.less'
			]
		},
		// concat
		concat: {
			dist: {
				src: [
					'<config:src.js>'
				],
				dest: 'dist/scripts.js'
			}
		},
		// minify
		min: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'dist/scripts.min.js'
			}
		},
		// watch
		watch: {
			files: '<config:src.js>',
			tasks: 'less concat min'
		},

		uglify: {},

		less: {
			all: {
				src: 'less/codecollision.less',
				dest: 'css/codecollision.css',
				options: {
					compress: true
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'less');


};
