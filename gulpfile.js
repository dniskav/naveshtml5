'use strict';

var src = './src';
var  dist = './public';
var  nodeModules = './node_modules';
var  gulp = require('gulp');
var  concat = require('gulp-concat');
var  sourcemaps = require('gulp-sourcemaps');
var  uglify = require('gulp-uglify');
var  file = require('file');
var  path = require('path');
var  livereload = require('gulp-livereload');
var  tasks = {};

tasks.build = function () {};
tasks.server = function () {};
tasks.watch = function () {};

gulp.task('build', tasks.build);
gulp.task('server', tasks.server);
gulp.task('watch', tasks.watch);
gulp.task('default', [

]);