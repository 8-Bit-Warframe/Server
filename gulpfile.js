const gulp = require('gulp');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('default', function () {
	return gulp.src('typescript/**/*.ts')
		.pipe(tsProject()).js
		.pipe(babel())
		.pipe(gulp.dest('javascript'));
});