const gulp = require('gulp');
const path = require('path');
const browserSync = require('browser-sync').create();
const basetheme = require('@hopin/hugo-base-theme');
const booktheme = require('@gauntface/web-push-book-theme');
const hugo = require('@gauntface/hugo-node');
const clean = require('@hopin/wbt-clean');
const htmlmin = require('gulp-htmlmin');
const ham = require('@gauntface/html-asset-manager');

const desiredHugoVersion = 'v0.72.0';

/**
 * Themes
 */
gulp.task('hopin-base-theme', () => {
  return basetheme.copyTheme(path.join(__dirname, `themes`, 'hopin-base-theme'));
})
gulp.task('web-push-book-theme', () => {
  return booktheme.copyTheme(path.join(__dirname, `themes`, 'web-push-book'));
})
gulp.task('themes', gulp.parallel(
  'hopin-base-theme',
  'web-push-book-theme',
))

/**
 * Build the site
 */
gulp.task('check-hugo-version', async () => {
  const v = await hugo.version();
  if (v != desiredHugoVersion) {
    throw new Error(`Wrong hugo version; got ${v}, want ${desiredHugoVersion}`)
  }
})

gulp.task('clean', gulp.series(
  clean.gulpClean([
    path.join(__dirname, 'public'),
    path.join(__dirname, 'themes'),
  ]),
))

gulp.task('hugo-build', async () => {
  await hugo.build(__dirname);
})

gulp.task('genimgs', () => {
  return ham.generateImages({
    config: path.join(__dirname, 'asset-manager.json'),
    output: true,
  });
})

gulp.task('html-assetmanager', () => {
  return ham.manageAssets({
    config: path.join(__dirname, 'asset-manager.json'),
    vimeo: process.env['VIMEO_TOKEN'],
    debug: 'static-site-hosting-on-aws',
    output: true,
  });
});

gulp.task('minify-html', () => {
  return gulp.src(path.join(__dirname, 'public', '**', '*.html'))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
    }))
    .pipe(gulp.dest(path.join(__dirname, 'public')));
})

gulp.task('copy-verification',() => {
  return gulp.src(path.join(__dirname, 'verification', '**', '*'))
    .pipe(gulp.dest(path.join(__dirname, 'public')));
})

gulp.task('build-base', gulp.series(
  'check-hugo-version',
  'clean',
  'themes',
  'hugo-build',
));

gulp.task('build', gulp.series(
  'genimgs',
  'build-base',
  'html-assetmanager',
  'minify-html',
  'copy-verification',
))

/**
 * Watch Prod
 */
gulp.task('watch-site-theme-prod', () => {
  const opts = {
    ignoreInitial: true,
  };
  return gulp.watch(
    [path.join(__dirname, 'node_modules', '@gauntface/web-push-book-theme', '**', '*')],
    opts,
    gulp.series('themes', 'build'),
  );
});

gulp.task('watch-any', () => {
  const opts = {
    delay: 500,
    ignoreInitial: true,
  };
  return gulp.watch(
    [
      path.posix.join(__dirname, 'archetypes', '**', '*'),
      path.posix.join(__dirname, 'content', '**', '*'),
      path.posix.join(__dirname, 'static', '**', '*'),
      path.posix.join(__dirname, 'vertification', '**', '*'),
    ],
    opts,
    gulp.series('build', async () => browserSync.reload()),
  );
});

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "./public/",
      }
  });
});

gulp.task('watch-prod',
  gulp.series(
    'build',
    gulp.parallel(
      'browser-sync',
      'watch-site-theme-prod',
      'watch-any',
    ),
  ),
);