const gulp = require('gulp');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const clean = require('gulp-clean');
const debug = require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const tsProject = ts.createProject('tsconfig.json');

const tslintOptions = {
	formatter: 'stylish',
	fix: true
};
const tslintReportOptions = {
	emitError: true,
	allowWarnings: true
};

gulp.task('clean', () => gulp.src('dist').pipe(clean()));

gulp.task('default', () => {
	tsProject.src().pipe(tslint(tslintOptions)).pipe(tslint.report());
});

gulp.task('tslint', ['clean'], () => {
	return gulp
		.src('src/**/*.ts', { base: '.' })
		.pipe(tslint(tslintOptions))
		.pipe(tslint.report(tslintReportOptions));
});

gulp.task('assets', ['tslint'], () => {
	return gulp.src('src/assets/**.*').pipe(gulp.dest('dist/assets'));
});

gulp.task('public', ['assets'], () => {
	return gulp.src('src/public/**/*.*').pipe(gulp.dest('dist/public'));
});

gulp.task('nodered', ['public'], () => {
	return gulp.src('.nodered/flows.json').pipe(gulp.dest('dist/.nodered'));
});

gulp.task('build', ['nodered'], () => {
	return tsProject
		.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject(ts.reporter.fullReporter()))
		.pipe(
			sourcemaps.write('.', {
				sourceRoot: function (file) {
					return file.cwd + '/src';
				}
			})
		)
		.pipe(gulp.dest('dist'));
});

gulp.task('nodemon', ['build'], () => {
	return nodemon({
		script: 'src/index.ts',
		watch: 'src',
		ext: 'ts',
		delay: 1500,
		verbose: true,
		nodeArgs: ['--inspect', '--require', 'ts-node/register'],
		env: {
			'TS_NODE_FILES': 'true'
		},
		tasks: ['build']
	});
});

gulp.task('build:watch', ['build'], () => {
	gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('build:release', ['nodered'], () => {
	return tsProject
		.src()
		.pipe(tsProject(ts.reporter.fullReporter()))
		.pipe(gulp.dest('dist'));
});
