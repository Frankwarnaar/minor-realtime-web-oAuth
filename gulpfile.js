const babelify  = require('babelify'),
	browserSync = require('browser-sync'),
	browserify  = require('browserify'),
	buffer      = require('vinyl-buffer'),
	clean       = require('gulp-clean'),
	gulp        = require('gulp'),
	gulpif      = require('gulp-if'),
	gutil       = require('gulp-util'),
	nodemon     = require('gulp-nodemon'),
	sass        = require('gulp-sass'),
	sequence    = require('run-sequence'),
	source      = require('vinyl-source-stream'),
	sourcemaps  = require('gulp-sourcemaps'),
	watchify    = require('watchify');

/* ============================================================
Configuration
============================================================ */

const config = {
	assetsPath: 'src/client',
	distPath: 'dist',
	debug: true
};

gulp.task('disable-debug', () => {
	config.debug = false;
});

/* ============================================================
	Main tasks
   ============================================================ */

gulp.task('default', () => {
	sequence(['watch', 'server'], ['browser-sync']);
});

gulp.task('build', () => {
	sequence(['clean', 'disable-debug'], ['sass', 'watchify', 'fonts', 'images']);
});

gulp.task('clean', () => {
	return gulp.src(config.distPath, {read: false})
		.pipe(clean());
});

/* ============================================================
	Server
   ============================================================ */

gulp.task('server', cb => {
	return nodemon({
		script: 'src/server/app.js',
		watch: 'src/server/'
	}).once('start', cb);
});

/* ============================================================
	Watch
   ============================================================ */

gulp.task('watch', ['watch:html', 'watchify', 'watch:sass']);

gulp.task('watch:sass', ['sass'], () => {
	return gulp.watch(config.assetsPath + '/styles/**/*.scss', ['sass']);
});

gulp.task('watch:html', () => {
	return gulp.watch(['src/server/views/*', 'src/server/views/**/*']).on('change', browserSync.reload);
});
/* ============================================================
	Error handler
   ============================================================ */

const handleError = err => {
	gutil.log(err);
	browserSync.notify('An error occured!');
};

/* ============================================================
	Less
   ============================================================ */

gulp.task('sass', () => {
	return gulp.src(config.assetsPath + '/styles/app.scss')
		.pipe(sass())
		.on('error', gutil.log)
		.pipe(gulp.dest(config.distPath + '/css'))
		.pipe(browserSync.stream());
});

/* ============================================================
	Javascript
   ============================================================ */

gulp.task('watchify', () =>  {
	const props = {
		entries: [config.assetsPath + '/js/app.js'],
		debug: config.debug,
		cache: {},
		packageCache: {}
	};

	const bundler = config.debug ? watchify(browserify(props)) : browserify(props);
	bundler.transform(babelify, {presets: ['es2015-without-strict']});

	function rebundle() {
		const stream = bundler.bundle();
		return stream.on('error', handleError)
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: config.debug
			}))
			.pipe(gulpif(config.debug, sourcemaps.write('./')))
			.pipe(gulp.dest(config.distPath + '/js/'))
			.pipe(browserSync.stream());
	}

	bundler.on('update', () => {
		rebundle();
		gutil.log('Rebundle...');
	});

	return rebundle();
});

/* ============================================================
	Browser-sync
   ============================================================ */

gulp.task('browser-sync', () => {
	browserSync.init({
		proxy: 'http://localhost:3000',
		port: 3001,
		files: ['build/client/css/app.css', 'build/client/js/app.js']
	});
});

/* ============================================================
	Fonts
   ============================================================ */

gulp.task('fonts', () => {
	gulp.src(`${config.assetsPath}/fonts/**`)
		.pipe(gulp.dest(config.distPath + '/fonts'));
});

/* ============================================================
	Image compression
   ============================================================ */

gulp.task('images', () => {
	gulp.src(`${config.assetsPath}/img/**/*`)
		.pipe(gulp.dest(`${config.distPath}/img`));
});