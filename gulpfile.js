var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('compile-sass', function() {
    gulp.src('src/sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('watch', function() {
    gulp.watch('src/sass/**/*.sass', ['compile-sass']);
});
