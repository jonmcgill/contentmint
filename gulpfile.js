var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    server = require('live-server');

function p(path) {
    return './src/refactored/' + path + '.js';
}

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

var refactored_files = [
    
    p('system/Cmint.Setup'),
    p('system/Cmint.Settings'),
    p('system/Bus/Bus.setup'),
    p('system/Util/*'),

    p('system/Sync/Sync.fn'),
    p('system/Sync/Sync.getStagePosition'),
    p('system/Sync/Sync.getComponentData'),
    p('system/Sync/Sync.getVmContextData'),
    p('system/Sync/Sync.insertVmContextData'),

    p('system/Api/*'),

    p('components/meta/meta.comp'),
    p('components/meta/meta.context'),
    p('components/ui/ui.toolbar'),
    p('components/ui/ui.sidebar'),
    p('components/ui/ui.categories'),

    p('system/Cmint.Init')

];

var js_vendor = [
    './vendor/jquery/jquery-3.1.1.min.js', './vendor/lodash/lodash.js',
    './vendor/dragula/dragula.min.js', './vendor/vue/vue.js',
]

gulp.task('build', function() {
    gulp.src(js_files)
        .pipe(concat('contentmint.js'))
        .pipe(gulp.dest('dist/'));
})

gulp.task('build-ref', function() {
    gulp.src(js_vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/'));
    gulp.src(refactored_files)
        .pipe(concat('refactored.js'))
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

gulp.task('dev-ref', ['build-ref'], function() {
    server.start({
        host: 'localhost',
        port: 3000,
        watch: ['dist/**/*', 'index.html', 'example.html']
    })
    gulp.watch('src/refactored/**/*.js', function() {
        return gulp.src(refactored_files)
            .pipe(concat('refactored.js'))
            .pipe(gulp.dest('dist/'));
    })
    gulp.watch('src/scss/**/*.scss', function() {
        return gulp.src('src/scss/**/*.scss')
            .pipe(plumber())
            .pipe(sass())
            .pipe(gulp.dest('dist/'))
    })
})