var gulp = require('gulp');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var babel = require('gulp-babel');
var changed = require('gulp-changed');

gulp.task('autoprefixer', () => {
  gulp.src('dev/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('html', function () {
  return gulp.src('dev/**/*.+(html|htm)')
  .pipe(changed('dist'))
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp.src('dev/resources/*.+(png|jpg)')
  .pipe(changed('dist/resources'))
  .pipe(imagemin())
  .pipe(gulp.dest('dist/resources'));
});

gulp.task('babel', () => {
  return gulp.src('dev/**/*.js')
  .pipe(changed('dist'))
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream());
});

gulp.task('watch', ['browserSync', 'build'], function () {
  gulp.watch('dev/**/*.css', ['autoprefixer', browserSync.reload]);
  gulp.watch('dev/**/*.html', ['html', browserSync.reload]);
  gulp.watch('dev/**/*.js', ['babel', browserSync.reload]);
});

gulp.task('build', ['html', 'images', 'babel', 'autoprefixer']);
