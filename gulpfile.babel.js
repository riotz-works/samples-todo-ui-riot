'use strict';

import gulp from 'gulp';
import s3 from 'gulp-s3';
import replace from 'gulp-replace';

gulp.task('deploy', () => {

    const AWS = {
        "key":    process.env.AWS_ACCESS_KEY_ID,
        "secret": process.env.AWS_SECRET_ACCESS_KEY,
        "bucket": process.env.DIST_BUCKET_NAME,
        "region": process.env.DIST_BUCKET_REGION
    };

    const options = { 
        headers: {
            'x-amz-acl': 'private'
        } 
    };

    gulp.src('src/**/*')
        .pipe(replace('<<API_ENDPOINT>>', process.env.API_ENDPOINT))
        .pipe(s3(AWS, options));
});
