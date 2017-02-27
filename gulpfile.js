var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    server = require('live-server');


var js_files = [
    
    './src/js/core/system/setup.js',
    './src/js/core/system/util.js',
    './src/js/core/system/index.js',
    './src/js/core/system/cmint.js',

    './src/js/core/components/wrap.js',
    './src/js/core/components/context.js',
    './src/js/core/components/categories.js',
    './src/js/core/components/sidebar.js',
    './src/js/core/components/actionbar.js',
    './src/js/core/components/overlay.js',
    './src/js/core/components/toolbar.js',

    './src/js/components/**/*',
    './src/js/processing/**/*',
    './src/js/menus/**/*',
    './src/js/fields/**/*',
    './src/js/templates/**/*',

    './src/js/core/fields/field-text.js',
    './src/js/core/fields/field-dropdown.js',
    './src/js/core/fields/field-choice.js',
    './src/js/core/fields/field-group.js',
    './src/js/core/fields/field.js',
    './src/js/core/fields/fields.js',

    './src/js/core/drag/drag.js',
    './src/js/core/drag/fn/*',
    './src/js/core/system/editor.js',
    './src/js/core/system/fn/*',
    './src/js/core/system/app.js'
    
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
    gulp.watch('src/js/**/*.js', function() {
        return gulp.src(js_files)
            .pipe(concat('build.js'))
            .pipe(gulp.dest('dist/'));
    })
    gulp.watch('src/scss/**/*.scss', function() {
        return gulp.src('src/scss/**/*.scss')
            .pipe(plumber())
            .pipe(sass())
            .pipe(gulp.dest('dist/'))
    })
})