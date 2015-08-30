var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var reactify = require('reactify');
var download = require('gulp-download');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');

var path = {
	HTML: 'web/src/index.html',

	OUT: 'build.js',
	MINIFIED_OUT: 'build.min.js',

	IMAGES: ['web/src/images/**/*'],
	DEST_IMAGES: 'web/dist/images',

	DEST: 'web/dist',
	ENTRY_POINT: 'web/src/components/main.jsx',

	semanticUI: 'web/static/semantic.min.js',
	jQuery: 'web/static/jquery.min.js',

	AUTOBUILD: 'web/src/**/*',

	FONT: 'web/static/themes/default/assets/fonts/',

	APPS: 'apps',

	APP_ENTRY_POINT: 'apps/notes/web/src/components/main.jsx',

	APP_DEST: 'apps/notes/web/dist',

	STATIC: 'web/static'
};

var url = {
	semanticUI: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.0.8/semantic.min.js',
	jQuery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js',
	semanticUICSS: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.0.8/semantic.min.css',
	semanticUIFont: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.0.8/themes/default/assets/fonts/icons.woff2',
	socketIOClient: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js'
};

var browserifyArguments = {
	transform: [reactify],
	shim: {
		'jQuery': {
			path: path.jQuery,
			exports: '$'
		},
		'semantic-ui': {
			path: path.semanticUI,
			exports: null,
			depends: {
				jQuery: 'jquery'
			}
		}
	}
};

gulp.task('downloadSemantic', function () {
	return download(url.semanticUI)
		.pipe(gulp.dest(path.STATIC));
});

gulp.task('downloadJQuery', function () {
	return download(url.jQuery)
		.pipe(gulp.dest(path.STATIC));
});

gulp.task('downloadSemanticCSS', function () {
	return download(url.semanticUICSS)
		.pipe(rename(function (path) {
			path.basename = 'semantic.min';
			path.extname = '.css';
		}))
		.pipe(gulp.dest(path.STATIC));
});

gulp.task('downloadSemanticFont', function () {
	return download(url.semanticUIFont)
		.pipe(gulp.dest(path.FONT));
});

gulp.task('build', function () {
	return gulp.src(path.ENTRY_POINT)
		.pipe(browserify(browserifyArguments))
		.pipe(rename(function (path) {
			path.basename = 'app';
			path.extname = '.js';
		}))
		.pipe(gulp.dest(path.DEST));
});

gulp.task('copyHTML', function () {
	return gulp.src(path.HTML)
		.pipe(gulp.dest(path.DEST));
});

gulp.task('copyImages', function (callback) {
	return gulp.src(path.IMAGES)
		.pipe(gulp.dest(path.DEST_IMAGES));
});

gulp.task('default', function (callback) {
	return runSequence(
		['copyHTML', 'copyImages'],
		['downloadSemantic', 'downloadJQuery', 'downloadSemanticCSS', 'downloadSemanticFont'],
		'build',
		callback
	);
});

gulp.task('nodownload', function (callback) {
	return runSequence(
		['copyHTML', 'copyImages'],
		'build',
		callback
	);
});

gulp.task('autobuild', function (callback) {
	watch(path.AUTOBUILD, {ignoreInitial: false}, function() {
    	gulp.start('default');
	});
});

gulp.task('autobuildnodownload', function (callback) {
	watch(path.AUTOBUILD, {ignoreInitial: false}, function() {
    	gulp.start('nodownload');
	});
});

gulp.task('app', function (callback) {
	return runSequence(
		['copyAppHTML', 'buildApp']
	);
});

gulp.task('copyAppHTML', function (callback) {
	return gulp.src(path.APPS + '/notes/web/src/index.html')
		.pipe(gulp.dest(path.APPS + '/notes/web/dist'));
});

gulp.task('buildApp', function (callback) {
	return gulp.src(path.APP_ENTRY_POINT)
		.pipe(browserify({
			transform: [reactify]
		}))
		.pipe(rename(function (path) {
			path.basename = 'app';
			path.extname = '.js';
		}))
		.pipe(gulp.dest(path.APP_DEST));
});

gulp.task('download', function (callback) {
	return download(url.socketIOClient)
		.pipe(gulp.dest(path.STATIC));
});
