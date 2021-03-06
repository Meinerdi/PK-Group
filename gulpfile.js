var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');
    wait = require('gulp-wait');

    gulp.task('sass', function() {
        return gulp.src('src/sass/*.scss')
        .pipe(wait(100)) // 200, 300... For fix saves on VS Code
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('src/css/'))
        .pipe(browserSync.reload({stream: true}))
    });

//Path to JS libs
gulp.task('scripts', function() {
    return gulp.src([
        'src/libs/jquery/dist/jquery.min.js',
        'src/libs/slick-carousel/slick/slick.min.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'))
});

//Minify CSS libs
gulp.task('css-libs', ['sass'], function() {
    return gulp.src('src/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src/css'));
});

//Browser Sync
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

//Delete "dist" folder before "gulp build"
gulp.task('clean', function() {
    return del.sync('dist');
});

// If need clean cash (for optimize pictures)
gulp.task('clear', function() {
    return cache.clearAll();
});

//Path to images for optimize
gulp.task('img', function() {
    return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/images'));
});

//Path to watch file changes for "browser sync"
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

//Build command
gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
    var buildCss = gulp.src([
        'src/css/main.css',
        'src/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));

    var buildVideo = gulp.src('src/vid/**/*')
    .pipe(gulp.dest('dist/vid'))
});