var gulp = require("gulp"),
	browserSync = require("browser-sync");

	gulp.task("server", function() {
		browserSync({
			port: 9000,
			server: {
				baseDir: "./"
			}
		});
	});

	gulp.task("watch", function() {
		gulp.watch([
			"./*.html",
			"./js/**/*.js",
			"./css/**/*.css"
		]).on("change", browserSync.reload);
	});

	gulp.task("default", ["server", "watch"]);