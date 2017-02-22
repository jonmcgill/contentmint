var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    server = require('live-server');


var js_files = [
    
    './src2/js/core/system/setup.js',
    './src2/js/core/system/util.js',
    './src2/js/core/system/index.js',
    './src2/js/core/system/cmint.js',
    './src2/js/core/components/wrap.js',
    './src2/js/core/components/context.js',
    './src2/js/components/**/*',
    './src2/js/processing/**/*',
    './src2/js/fields/**/*',
    './src2/js/core/fields/field-text.js',
    './src2/js/core/fields/field.js',
    './src2/js/core/fields/fields.js',
    './src2/js/core/system/drag/drag.js',
    './src2/js/core/system/drag/fn/*',
    './src2/js/core/system/fn/*',
    './src2/js/core/system/app.js'
    
];

gulp.task('build', function() {
    gulp.src(js_files)
        .pipe(concat('build.js'))
        .pipe(gulp.dest('dist/'));
})

gulp.task('dev', function() {
    server.start({
        host: 'localhost',
        port: 3000,
        watch: ['dist/**/*', 'index.html', 'sb.html']
    })
    gulp.watch('src2/js/**/*.js', function() {
        return gulp.src(js_files)
            .pipe(concat('build.js'))
            .pipe(gulp.dest('dist/'));
    })
    gulp.watch('src/scss/**/*.scss', function() {
        return gulp.src('src/scss/**/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('dist/'))
    })
})