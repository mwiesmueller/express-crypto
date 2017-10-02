'use strict';

const eslint = require('gulp-eslint');
const cover = require('gulp-coverage');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const shell = require('gulp-shell');

const paths = {
  analyze: [ '**/*.js', '!coverage/**/*.js', '!test/testPattern.js' ],
  tests: [ 'test/**/*Test.js', '!coverage/**/*.js' ]
};

/* eslint-disable no-process-exit */
gulp.task('test', () => {
  return gulp.src(paths.tests, { read: false }).
	pipe(mocha({ timeout: 55000 })).
	once('error', function (err) {
  /* eslint-disable no-console */
  console.log(err.stack);
  /* eslint-enable no-console*/
  process.exit(1);
	}).
	once('end', function () {
  process.exit();
	});
});

gulp.task('lint', function () {
  return gulp.src(paths.analyze).
		pipe(eslint()).
    pipe(eslint.format()).
    pipe(eslint.failAfterError());
});

/* eslint-disable no-process-env */
gulp.task('coverage', function () {
  process.env.IS_TEST = true;
  process.env.LOG_LEVELS = 'info';

  return gulp.src(paths.tests, { read: false }).
    pipe(cover.instrument({
      pattern: [ 'test/testPattern.js' ],
      debugDirectory: './debug'
    })).
    pipe(mocha({ timeout: 15000 })).
    pipe(cover.gather()).
    pipe(cover.format({ reporter: 'html', outFile: 'coverage.html' }, { reporter: 'json', outFile: 'coverage.json' })).
    pipe(gulp.dest('./coverage')).
    once('end', function () {
      process.exit();
    });
});

/* eslint-enable no-process-env */

gulp.task('default', shell.task([
  'gulp lint && ' +
	'gulp test'
]));
/* eslint-enable no-process-exit */
