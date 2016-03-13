var gulp = require("gulp"),
	browserSync = require("browser-sync"),
	uglify = require('gulp-uglify'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	useref = require('gulp-useref'),
	autoprefixer = require('gulp-autoprefixer'),
	gulpif =require("gulp-if");

	gulp.task("server", function() {
		browserSync({
			port: 9000,
			server: {
				baseDir: "app"
			}
		});
	});

	gulp.task("watch", function() {
		gulp.watch([
			"app/*.html",
			"app/js/**/*.js",
			"app/css/**/*.css"
		]).on("change", browserSync.reload);
	});

	gulp.task("default", ["server", "watch"]);

	/** production **/
	gulp.task('minify-main-js', function() {
	  gulp.src('app/js/*.js')
	    .pipe(gulpif('*.js',uglify({})))
	    .pipe(gulp.dest('app/project/js'))
	});
	gulp.task('minify-lang-js', function() {
	  gulp.src('app/js/lang/*.*')
	    .pipe(gulpif('*.js',uglify({})))
	    .pipe(gulp.dest('app/project/js/lang'))
	});

	gulp.task('minify-css', function () {
	  gulp.src(['app/css/*.css'])
	  	.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(cssmin())
		.pipe(gulp.dest('app/project/css'));
	});
	gulp.task('fonts', function () {
	  gulp.src('app/fonts/*.*')
		.pipe(gulp.dest('app/project/fonts'));
	});
	gulp.task('php', function () {
	  gulp.src('app/php/*.*')
		.pipe(gulp.dest('app/project/php'));
	});
	gulp.task('img', function () {
	  gulp.src('app/images/*.*')
		.pipe(gulp.dest('app/project/images'));
	});

	gulp.task('production-vendor', function(){
		return gulp.src('app/*.html')
			.pipe(useref())
		.pipe(gulpif('*.js', uglify({})))
			// .pipe(gulpif('*.js', uglify({})))
			.pipe(gulpif('*.css',autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			})))
			.pipe(gulpif('*.css',cssmin()))
			.pipe(gulp.dest('app/project/'));
	});
	gulp.task('production-over', ['minify-main-js','minify-lang-js','minify-css','fonts','php',"img"]);
	gulp.task('build', ['production-vendor','production-over']);