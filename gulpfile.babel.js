'use strict';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import s3 from 'gulp-s3';

// Environment variables
const CORE_API_ENDPOINT       = process.env.API_ENDPOINT;
const AWS_ACCESS_KEY_ID       = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY   = process.env.AWS_ACCESS_KEY_ID;
const DEPLOY_BUCKET_NAME      = process.env.DEPLOY_BUCKET_NAME;
const DEPLOY_BUCKET_REGION    = process.env.DEPLOY_BUCKET_REGION;

gulp.task('browser-sync', () => {
    browserSync.init({ server: './dist' });
});

gulp.task('build', () => {

    gulp.src('src/**/*.html')
        .pipe(gulp.dest('./dist/'));

    gulp.src('src/css/**/*.css')
        .pipe(gulp.dest('./dist/css/'));

    gulp.src('src/js/**/*.js')
        .pipe(replace('<<API_ENDPOINT>>', CORE_API_ENDPOINT))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('deploy', () => {
    const AWS = {
        "key":    AWS_ACCESS_KEY_ID,
        "secret": AWS_SECRET_ACCESS_KEY,
        "bucket": DEPLOY_BUCKET_NAME,
        "region": DEPLOY_BUCKET_REGION
    };
    const options = { 
        headers: {
            'x-amz-acl': 'private'
        } 
    };
    gulp.src('dist/**/*').pipe(s3(AWS, options));
});
