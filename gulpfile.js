const gulp = require('gulp');
const rename = require("gulp-rename");
const browserSync = require('browser-sync').create();
const gulpPlumber = require('gulp-plumber');
const uglify = require('gulp-uglify');

gulp.task('default', ['js', 'watch', 'browser-sync']);

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: '.'
    },
    startPath: './sample',
    port  : 8080
  });
});

gulp.task('watch', function () {
  gulp.watch(['./sample/*.html', './sample/*.htm'])
    .on('change', browserSync.reload);
  gulp.watch('./src/**/*.js', ['js'])
    .on('change', browserSync.reload);
});

gulp.task('js', function () {
  return gulp.src('./src/**/*.js')
    .pipe(gulpPlumber())
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += ".min";
      path.extname = ".js";
    }))
    .pipe(gulp.dest('./dist'));
});
console.log('ok');