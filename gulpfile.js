var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    server = require('live-server');


var js_files = [
    
    './src/js/global.js',

    './src/js/component-wrapper.js',
    './src/js/component-context.js',
    './src/js/component-field.js',

    './src/js/component-heading.js',
    './src/js/component-body-copy.js',
    './src/js/component-two-column.js',
    './src/js/component-banner.js',
    './src/js/componentDefaults.js',
    
    './src/js/app.js',

    './src/js/nodes.js',
    './src/js/documentHandlers.js',
    './src/js/util.js',
    './src/js/collectData.js',
    './src/js/walk.js',
    './src/js/dom-data-sync.js',

    './src/js/initStageComponent.js',
    './src/js/initEditor.js',
    './src/js/initDragula.js',
    
];


gulp.task('dev', function() {
    server.start({
        host: 'localhost',
        port: 3000,
        watch: ['dist/**/*', 'index.html']
    })
    gulp.watch('src/js/**/*.js', function() {
        return gulp.src(js_files)
            .pipe(concat('Build.js'))
            .pipe(gulp.dest('dist/'));
    })
    gulp.watch('src/scss/**/*.scss', function() {
        return gulp.src('src/scss/**/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('dist/'))
    })
})