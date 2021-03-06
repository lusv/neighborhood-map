var gulp = require("gulp"),
  browserify = require('browserify'),
  streamify  = require('gulp-streamify'),
  source = require('vinyl-source-stream'),
  minifyHTML = require("gulp-minify-html"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  cssmin = require("gulp-cssmin"),
  mainBowerFiles = require("main-bower-files"),
  inject = require("gulp-inject"),
  del = require('del'),
  watch = require('gulp-watch');

gulp.task('clean', [], function() {
  return del.sync('dist/*');
});

gulp.task("html", function() {
  return gulp.src("src/**/*.html")
    .pipe(inject(
      gulp.src(
        mainBowerFiles(),
        {read: false, cwd: "bower_components"}
      ),
      {name: "bower", addPrefix: "lib", addRootSlash: false}
    ))
    .pipe(minifyHTML({quotes:true}))
    .pipe(gulp.dest("dist"));
});

gulp.task('js', function() {
  return browserify('./src/js/app.js').bundle()
    .pipe(source('app.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('dist/js'))
});

gulp.task("json", function() {
  return gulp.src("src/*.json")
    .pipe(gulp.dest("dist"));
});

gulp.task("css", function() {
  return gulp.src("src/css/**/*.css")
    .pipe(concat("main.min.css"))
    .pipe(cssmin())
    .pipe(gulp.dest("dist/css"));
});

gulp.task("img", function() {
  return gulp.src("src/img/**/*.*")
    .pipe(gulp.dest("dist/img"));
});

gulp.task("bower", function() {
  return gulp.src(mainBowerFiles(), {base: "bower_components"})
    .pipe(gulp.dest("dist/lib"));
});

gulp.task("watch", function () {
  gulp.watch("src/**/*.*", ["default"]);
});

gulp.task("default", ["clean", "html", "js", "json", "css", "img", "bower"]);
