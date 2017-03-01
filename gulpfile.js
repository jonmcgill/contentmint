var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    server = require('live-server');


var js_files = [
    
    './vendor/jquery/jquery-3.1.1.min.js',
    './vendor/lodash/lodash.js',
    './vendor/dragula/dragula.min.js',
    './vendor/vue/vue.js',

    './src/js/system/setup.js',
    './src/js/system/util.js',
    './src/js/system/index.js',
    './src/js/system/cmint.js',

    './src/js/components/wrap.js',
    './src/js/components/context.js',
    './src/js/components/categories.js',
    './src/js/components/sidebar.js',
    './src/js/components/actionbar.js',
    './src/js/components/overlay.js',
    './src/js/components/toolbar.js',
    './src/js/components/custom-add.js',

    './src/js/fields/field-text.js',
    './src/js/fields/field-dropdown.js',
    './src/js/fields/field-choice.js',
    './src/js/fields/field-group.js',
    './src/js/fields/field.js',
    './src/js/fields/fields.js',

    './src/js/drag/drag.js',
    './src/js/drag/fn/*',
    './src/js/system/editor.js',
    './src/js/system/fn/*',
    './src/js/system/app.js'
    
];

gulp.task('build', function() {
    gulp.src(js_files)
        .pipe(concat('contentmint.js'))
        .pipe(gulp.dest('dist/'));
})

gulp.task('dev', function() {
    server.start({
        host: 'localhost',
        port: 3000,
        watch: ['dist/**/*', 'index.html']
    })
    gulp.watch('src/js/**/*.js', function() {
        return gulp.src(js_files)
            .pipe(concat('contentmint.js'))
            .pipe(gulp.dest('dist/'));
    })
    gulp.watch('src/scss/**/*.scss', function() {
        return gulp.src('src/scss/**/*.scss')
            .pipe(plumber())
            .pipe(sass())
            .pipe(gulp.dest('dist/'))
    })
})