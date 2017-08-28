'use strict';

import gulp from 'gulp';

gulp.task('build', () => {
    gulp.src('src/**/*')
        .pipe(gulp.dest('dist'));
});
