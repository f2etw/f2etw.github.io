var gulp = require('gulp');
var matter = require('gulp-front-matter');
var marked = require('gulp-marked');
var layout = require('gulp-layoutize');
var sass = require('gulp-sass');
var replace = require('gulp-replace');
var swig = require('swig');

gulp.task('pages:md', function () {
	return gulp.src(['./*.md', '!README.md'])
		.pipe(matter({property: 'page', remove: true}))
		.pipe(marked())
		.pipe(layout({
			templatePath: './_layouts/default.html',
			engine: 'swig',
			locals: {}
		}))
		.pipe(replace(/ id="-"/g, ' id="section"'))
		.pipe(gulp.dest('export'));
});

gulp.task('activities', function () {
	return gulp.src(['./_activities/*.md'])
		.pipe(matter({property: 'page', remove: true}))
		.pipe(marked())
		.pipe(layout({
			templatePath: './_layouts/default.html',
			engine: 'swig',
			locals: {}
		}))
		.pipe(replace(/ id="-"/g, ' id="section"'))
		.pipe(gulp.dest('export/activities'));
});

gulp.task('style', function () {
	return gulp.src(['./*.scss'])
		.pipe(matter({remove: true}))
		.pipe(sass({
			"outputStyle": "expanded",
			"includePaths": ["_sass"]
		}))
		.pipe(gulp.dest('export'));
});

gulp.task('pages', ['pages:md']);
gulp.task('build', ['pages', 'activities', 'style']);
gulp.task('default', ['pages', 'activities', 'style']);
