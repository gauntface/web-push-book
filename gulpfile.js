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

const parseContent = require('./utils/inline-source-code');

gulp.task('clean', () => {
  return del([BUILD_OUTPUT_PATH]);
});

gulp.task('copy', () => {
  return gulp.src([
    SRC_PATH + '/*.md',
    SRC_PATH + '/**/*.html'
  ])
  .pipe(gulp.dest(BUILD_OUTPUT_PATH));
});

gulp.task('images', () => {
  let stream = gulp.src([
    SRC_PATH + '/**/*.{png,jpg,jpeg,svg,gif}',
    `!${SRC_PATH}/{demo,demo/**}`,
  ]);
  if (prodBuild) {
    stream = stream.pipe(imagemin({
      progressive: true,
      interlaced: true
    }));
  }
  return stream.pipe(gulp.dest(BUILD_OUTPUT_PATH));
});

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
    stream = stream.pipe(cssimport({}))
      .pipe(postcss(processors));
  }

  return stream.pipe(gulp.dest(BUILD_OUTPUT_PATH));
});

gulp.task('watch', () => {
  gulp.watch(SRC_PATH + '/**/*', gulp.series('build:dev'));
});

gulp.task('jekyll', () => {
  spawn('jekyll', ['serve'], {
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
    )
  )
);

gulp.task('default', gulp.series('build:dev', gulp.parallel('watch', 'jekyll')))
