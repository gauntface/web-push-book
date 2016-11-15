'use strict';

const BUILD_OUTPUT_PATH = './build';
const SRC_PATH = './src';

let prodBuild = true;

const spawn = require('child_process').spawn;

const gulp = require('gulp');
const del = require('del');
const postcss = require('gulp-postcss');
const cssimport = require('gulp-cssimport');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const imageResize = require('gulp-image-resize');
const changed = require('gulp-changed');

const parseContent = require('./utils/inline-source-code');

gulp.task('clean', () => {
  return del([BUILD_OUTPUT_PATH]);
});

gulp.task('copy', () => {
  return gulp.src([
    SRC_PATH + '/*.md',
    SRC_PATH + '/*.ico',
    SRC_PATH + '/**/*.{html,js}',
    './node_modules/anchor-js/anchor.min.js'
  ])
  .pipe(gulp.dest(BUILD_OUTPUT_PATH));
});

gulp.task('images-svg', () => {
  const optimisedImagePath = BUILD_OUTPUT_PATH + '/images';
  return gulp.src([
    SRC_PATH + '/images/**/*.svg'
  ])
  .pipe(changed(optimisedImagePath))
  .pipe(imagemin({
    progressive: true,
    interlaced: true,
    svgoPlugins: [{removeViewBox: false}],
  }))
  .pipe(gulp.dest(optimisedImagePath));
});

gulp.task('images-other', () => {
  const optimisedImagePath = BUILD_OUTPUT_PATH + '/images';
  return gulp.src([
    SRC_PATH + '/images/**/*.{png,jpg,jpeg,gif}'
  ])
  .pipe(changed(optimisedImagePath))
  .pipe(imageResize({
    width : 800,
    quality: 0.8,
    imageMagick: true,
    flatten: true,
  }))
  .pipe(imagemin({
    progressive: true,
    interlaced: true,
    svgoPlugins: [{removeViewBox: false}],
  }))
  .pipe(gulp.dest(optimisedImagePath));
});

gulp.task('images', gulp.parallel('images-other', 'images-svg'));

gulp.task('styles', () => {
  const browserSupport = ['last 2 versions'];
  const processors = [
    cssnext({browsers: browserSupport, warnForDuplicates: false}),
    cssnano()
  ];

  let stream = gulp.src([
    SRC_PATH + '/**/*.css',
    `!${SRC_PATH}/{demo,demo/**}`,
  ]);
  if (prodBuild) {
    stream = stream.pipe(cssimport({
      extensions: ["css"]
    }))
    .pipe(postcss(processors));
  }

  return stream.pipe(gulp.dest(BUILD_OUTPUT_PATH));
});

gulp.task('watch', () => {
  gulp.watch(SRC_PATH + '/**/*', gulp.series('build:dev'));
});

gulp.task('jekyll', () => {
  spawn('jekyll', ['serve', '--incremental', '--force_polling'], {
    stdio: 'inherit'
  });
});

const makeDevBuild = () => {
  prodBuild = false;
  return Promise.resolve();
};

gulp.task('build:prod',
  gulp.series(
    'clean',
    gulp.parallel(
      'styles',
      'images',
      'copy',
      () => parseContent(
        BUILD_OUTPUT_PATH + '/_ebook', BUILD_OUTPUT_PATH + '/_content')
    )
  )
);

gulp.task('build:dev',
  gulp.series(
    'clean',
    makeDevBuild,
    gulp.parallel(
      'styles',
      'images',
      'copy',
      () => parseContent(
        BUILD_OUTPUT_PATH + '/_ebook', BUILD_OUTPUT_PATH + '/_content')
        .catch(err => console.log('Error Building Content: ', err))
    )
  )
);

gulp.task('default', gulp.series('build:dev', gulp.parallel('watch', 'jekyll')))
