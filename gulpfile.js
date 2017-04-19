var gulp = require("gulp"),
    electron = require("electron-connect").server.create(),
    ts = require("gulp-typescript"),
    webpack = require("webpack"),
    webpackConfig = require("./webpack.config.js");

var tsProject = ts.createProject("tsconfig.json");

var wpConfig = Object.create(webpackConfig);

gulp.task("watch", function () {
  electron.start();
  gulp.watch(["src/process/**/*.ts"], ["ts"]);
  gulp.watch(["src/renderer/**/*.ts", "src/renderer/**/*.vue"], ["vue"]);
  gulp.watch(["resources/*.html"], electron.reload);
  gulp.watch(["src/**/*.html"], electron.reload);
  gulp.watch(["build/**/*.js"], electron.restart);
});

gulp.task("build", ["vue", "ts"]);

gulp.task("ts", function () {
    return gulp.src(["src/process/Main.ts"])
        .pipe(tsProject())
        .pipe(gulp.dest("build"));
});

gulp.task("vue", function () {
    return webpack(wpConfig, function(err, stats) {
        electron.restart();
    });
});
