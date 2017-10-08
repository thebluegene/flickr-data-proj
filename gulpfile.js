var gulp = require('gulp')
var sass = require('gulp-sass')
var prefix = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var input = './sass/*.scss';
var output = './';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
}

gulp.task('sass', function(){
  return gulp
          .src(input)
          .pipe(sourcemaps.init())
          .pipe(sass(sassOptions).on('error', sass.logError))
          .pipe(sourcemaps.write())
          .pipe(prefix())
          .pipe(gulp.dest(output));
})

gulp.task('watch', function() {
  gulp.watch('./sass/*.scss');
})
