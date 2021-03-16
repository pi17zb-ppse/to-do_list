var gulp = require('gulp'),
	sass = require('gulp-sass'),
	cleanCSS = require('gulp-clean-css'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	gcmq = require('gulp-group-css-media-queries'),
	browserSync = require('browser-sync').create(),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	rigger = require('gulp-rigger'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	rimraf = require('rimraf'),
	reload = browserSync.reload,
	pug = require('gulp-pug');



var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		images: 'build/images/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: {
		html: 'src/views/*.pug',
		js: 'src/js/main.js',
		style: 'src/style/main.scss',
		images: 'src/images/**/*.*',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	watch: {
		html: 'src/**/*.pug',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss',
		images: 'src/images/**/*.*',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: './build'
};

var config = {
	server: {
		baseDir: "./build",
		directory: true
	},
	//tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "PipZip"
};
/*
gulp.task('html:build', function () {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});
*/
gulp.task('html:build', function buildHTML() {
	return gulp.src('src/views/*.pug')
		.pipe(pug({
		// Your options in here.
		pretty: true
		}))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
  });

gulp.task('js:build', function () {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(rigger())
		//.pipe(sourcemaps.init())
		//.pipe(uglify())
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task('style:build', function () {		
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		//.pipe(gcmq())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cleanCSS({rebase: false}))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

gulp.task('images:build', function () {
	return gulp.src(path.src.images)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.images))
		.pipe(reload({stream: true}));
});
gulp.task('img:build', function () {
	return gulp.src(path.src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});



gulp.task('build', gulp.parallel('html:build', 'js:build', 'style:build', 'fonts:build', 'images:build', 'img:build'));

gulp.task('watch', function(){
	gulp.watch([path.watch.html], gulp.series("html:build"));
	gulp.watch([path.watch.style], gulp.series("style:build"));
	gulp.watch([path.watch.js], gulp.series("js:build"));
	gulp.watch([path.watch.img], gulp.series("img:build"));
	gulp.watch([path.watch.images], gulp.series("images:build"));
	gulp.watch([path.watch.fonts], gulp.series("fonts:build"));
});

gulp.task('webserver', function () {
	browserSync.init(config);
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('webwatch', gulp.parallel('watch', 'webserver'));

gulp.task('default', gulp.series('build','webwatch'));
