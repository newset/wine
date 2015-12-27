var gulp = require('gulp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(["./*.html", 'css/*.css', 'js/*.js', '*.html', '*/*.html'])
  	.on('change', browserSync.reload);
});
