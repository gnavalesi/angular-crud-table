var gulp = require('gulp');
var gulpSeq = require('gulp-sequence');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var zip = require('gulp-zip');
var concat = require('gulp-concat');
var gls = require('gulp-live-server');
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var server = gls.static('build', 3000);

var pack = require('./package.json');
var serverStarted = false;

/**
 * Main tasks
 */
gulp.task('default', ['run']);

gulp.task('run', ['build'], function () {
	server.start();
	serverStarted = true;
});

gulp.task('dev', gulpSeq('run', 'watch'));

gulp.task('dist', ['build'], function () {
	return gulp.src('src/*')
		.pipe(zip(pack.name + '-' + pack.version + '.zip'))
		.pipe(gulp.dest('dist'));
});

/**
 * Development tasks
 */
gulp.task('watch', function () {
	gulp.watch(['./src/**/*.*', '!./src/**/*.scss'], function (event) {
		var base = './src/';
		var task = gulp.src(event.path, {base: base})
			.pipe(gulp.dest('./build/bower_components/angular-crud-table'));

		return taskNotifyServer(task);
	});

	gulp.watch(['./server/**/*.*', '!./server/app.js', '!./server/js/angular/**/*.js'], function (event) {
		var base = './server/';
		var task = gulp.src(event.path, {base: base})
			.pipe(gulp.dest('./build'));

		return taskNotifyServer(task);
	});

	gulp.watch(['./server/app.js', './server/js/angular/**/*.js'], ['reload-angular']);

	gulp.watch(['./src/**/*.scss'], ['sass']);
});

gulp.task('reload-angular', function (cb) {
	gulpSeq('jshint', 'join-angular')(cb);
});

/**
 * Build tasks
 */
gulp.task('build', gulpSeq('clean', 'jshint', ['copy-site', 'copy-angular-crud-table', 'join-angular', 'sass']));

gulp.task('clean', function () {
	return gulp.src('./build', {read: false})
		.pipe(clean());
});

gulp.task('copy-angular-crud-table', function() {
	var source = './src/**/**.*';
	var base = './src/';

	return gulp.src(source, {base: base})
		.pipe(gulp.dest('./build/bower_components/angular-crud-table'));
});

gulp.task('copy-site', function () {
	var source = ['./server/**/*.*', '!./server/js/angular/**/*', '!./server/app.js'];
	var base = './server/';

	return gulp.src(source, {base: base})
		.pipe(gulp.dest('./build'));
});

gulp.task('join-angular', function () {
	var source = ['./server/app.js', './server/js/angular/**/*.js'];
	var base = './server/';

	var task = gulp.src(source, {base: base})
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./build'));

	return taskNotifyServer(task);
});

gulp.task('sass', function() {
	var source = ['./src/**/*.scss'];
	var base = './src';

	var task = gulp.src(source, {base: base})
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./build/bower_components/angular-crud-table'));

	return taskNotifyServer(task);
});

/**
 * Code inspection tasks
 */
gulp.task('jshint', function () {
	return gulp.src('./src/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

function taskNotifyServer(task) {
	(function () {
		var data = [];

		task.on('data', function (event) {
			data.push(event);
		});

		task.on('end', function () {
			if (serverStarted && data.length > 0) {
				server.notify.apply(server, data);
			}
		});
	})();

	return task;
}