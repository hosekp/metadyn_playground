/**
 * @external require
 */
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    //concat = require('gulp-concat'),
    del = require('del'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    //stylish = require('jshint-stylish'),
    include = require('gulp-include');
    // ts = require('gulp-typescript'),
    // merge = require('merge2');
// print = require('gulp-print');
// replace = require('gulp-replace');

gulp.task('clean', function () {
  del([
    // 'src/build/*.html',
    'build/*',
    'includes/*'
    // '!src/includes/twigSetup*'
  ]);
});

gulp.task('js', function () {
  return gulp.src(['src/js/**/*.js'])
      .pipe(plumber())
      .pipe(print(function(filepath) {
        return "js check: " + filepath;
      }))
      .pipe(jshint())
      // .pipe(jshint.reporter('jshint-stylish'))
      // .pipe(gulp.dest('./includes/'))
      .on('end', function () {
        gulp.start('include-js');
      });
});

// gulp.task('typescript', function () {
//   var tsResult = gulp.src('lib/main.js')
//       .pipe(ts({
//         // declaration: true
//       }));
//
//   return merge([
//     tsResult.dts.pipe(gulp.dest('release/definitions')),
//     tsResult.js.pipe(gulp.dest('release/js'))
//   ]);
// });

// Nothin special here. Just good ole Sass compiling
gulp.task('sass', function () {
  return gulp.src('src/sass/*.scss')
      .pipe(plumber())
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(rename('styles.css'))
      .pipe(gulp.dest('./build/'));
  // .on('end', function () {
  //   gulp.start('include-sass');
  // });
});
gulp.task('move', function () {
  return gulp.src(['index.html'])
      .pipe(plumber())
      .pipe(gulp.dest('./build/'))
});


/*
 Ahh, the include makes things much prettier and easier to work on. This is
 basically just for convenience and restricting changes to single files while
 working on the template.
 */
gulp.task('include-js', function () {
  return gulp.src(['src/js/includes.js'])
      .pipe(plumber())
      // .pipe(print(function(filepath) {
      //   return "includes-typescript: " + filepath;
      // }))
      .pipe(include({
        extensions: "js",
        hardFail: true
        // includePaths: "/src/typescript"
      }))
      .pipe(gulp.dest('./build/'));
});
// gulp.task('include-sass', function () {
//   return gulp.src(['src/sass/includes.css'])
//       .pipe(plumber())
//       .pipe(include({
//             extensions: "scss",
//             hardFail: true,
//             includePaths: [
//               __dirname + "/src/sass"
//             ]
//           }
//       ))
//       .pipe(gulp.dest('./build/'));
// gulp.src('src/index.html')
//     .pipe(plumber())
//     .pipe(include())
//     .pipe(gulp.dest('./'));
// });


// The magic of watching files for changes
gulp.task('watch', function () {
  gulp.watch('src/typescript/*.ts', ['typescript']);
  gulp.watch('src/sass/*.scss', ['sass']);
  // gulp.watch('src/*.html', ['includes']);
});


// Just a simple build-only task
gulp.task('build', ['clean'], function () {
  gulp.start('typescript', 'sass', 'move');
});


/*
 Default is to run our tasks as though they've never been run before,
 then watch for changes as we go.
 */
// gulp.task('default', function(){
//   gulp.start('build', 'watch');
// });
