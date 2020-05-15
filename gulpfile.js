const gulp = require('gulp');
const path = require('path');
const basetheme = require('@hopin/hugo-base-theme');

gulp.task('hopin-base-theme', () => {
  return basetheme.copyTheme(path.join(__dirname, `themes`, 'hopin-base-theme'));
})

gulp.task('build', gulp.series([
    'hopin-base-theme',
]))