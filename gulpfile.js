var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    server = require('live-server');

function p(path) {
    return './src/js/' + path + '.js';
}

var js_files = [
    
    p('system/Cmint.Setup'),
    p('system/Cmint.Settings'),
    p('system/Bus/Bus.setup'),
    p('system/Bus/Bus.setSelectedCategory'),
    p('system/Util/*'),

    p('system/Sync/Sync.fn'),
    p('system/Sync/Sync.getStagePosition'),
    p('system/Sync/Sync.getComponentData'),
    p('system/Sync/Sync.getVmContextData'),
    p('system/Sync/Sync.insertVmContextData'),
    p('system/Sync/Sync.rearrangeVmContextData'),
    p('system/Sync/Sync.removeVmContextData'),
    
    p('system/Api/*'),

    p('components/meta/meta.comp'),
    p('components/meta/meta.context'),
    p('components/ui/ui.toolbar'),
    p('components/ui/ui.sidebar'),
    p('components/ui/ui.categories'),
    p('components/ui/ui.custom'),
    p('components/ui/ui.actionbar'),

    p('components/misc/misc.template'),
    p('components/misc/misc.overlay'),

    p('system/Editor/Editor.config'),
    p('system/Editor/Editor.init'),

    p('system/Ui/*'),
    p('system/Fields/*'),
    p('system/Hooks/*'),
    
    p('components/fields/fields.text'),
    p('components/fields/fields.dropdown'),
    p('components/fields/fields.group'),
    p('components/fields/fields.choice'),
    p('components/fields/fields.field'),
    p('components/fields/fields.fields'),

    p('system/Drag/Drag.fn'),
    p('system/Drag/Drag.onDrag'),
    p('system/Drag/Drag.onDrop'),
    p('system/Drag/Drag.onRemove'),
    p('system/Drag/Drag.init'),
    
    p('system/AppFn/*'),
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

gulp.task('dev', ['build', 'build-example'], function() {
    server.start({
        host: 'localhost',
        port: 3000,
        watch: ['dist/**/*', 'index.html', 'example/**/*']
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
    gulp.watch('example/**/*', ['build-example']);
})


gulp.task('build-example', function() {
    return gulp
        .src([
            'example/config/*',
            'example/template-config/*',
            'example/menus/*',
            'example/fields/*',
            'example/processes/*',
            'example/hooks/*',
            'example/components/*'
        ])
        .pipe(concat('example-app.js'))
        .pipe(gulp.dest('example/build/'));
})
