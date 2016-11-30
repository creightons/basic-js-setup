var _ = require('underscore'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	gulp = require('gulp'),
	gutil = require('gutil'),
	source = require('vinyl-source-stream'),
	babel = require('babelify'),
	watch = true,
	buildJsFile = 'main.bundle.js'
;


gulp.task('default', ['build']);

gulp.task('build', function() {
	build();
});

function build() {
	var file = 'main.js';
	var filepath = __dirname +'/dist';
	var options = {
		entries: [file],
		debug: true
	};
	
	var bundler;
	if (watch) {
		_.extend(options, watchify.args);
		bundler = watchify(browserify(options));
	}
	else {
		bundler = browserify(options);
	}
	
	bundler.transform(babel, {presets: ['es2015']});
	
	var rebundle = function() {
		return bundler.bundle()
			.on('error', gutil.log.bind(gutil, 'Browserify Error'))
			.pipe(source(buildJsFile))
			.pipe(gulp.dest(filepath))
		;
	}
	
	if (watch) {
		bundler.on('update', function() {
			gutil.log('-> bundling...');
			rebundle();
		});
	}
	
	bundler.on('log', gutil.log);
	
	return rebundle();
}