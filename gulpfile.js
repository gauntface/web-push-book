const gulp = require('gulp');
const path = require('path');
const basetheme = require('@hopin/hugo-base-theme');
const booktheme = require('@gauntface/web-push-book-theme');

gulp.task('hopin-base-theme', () => {
  return basetheme.copyTheme(path.join(__dirname, `themes`, 'hopin-base-theme'));
})
gulp.task('web-push-book-theme', () => {
  return booktheme.copyTheme(path.join(__dirname, `themes`, 'web-push-book'));
})

gulp.task('build', gulp.series([
    'hopin-base-theme',
    'web-push-book-theme',
]))