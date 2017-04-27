var gulp = require("gulp"),
    electron = require("electron-connect").server.create(),
    ts = require("gulp-typescript"),
    webpack = require("webpack"),
    webpackConfig = require("./webpack.config.js"),
    packager = require('electron-packager'),
    env = require('gulp-env'),
    pck = require('./package.json'),
    winInstaller = require('electron-winstaller');

var tsProject = ts.createProject("tsconfig.json");

var pckOptions = {
    prune: true,
    overwrite: true,
    out: "package",
    dir: ".",
    name: pck.name,
    osxSign: true,
    appVersion: pck.version
};

var metadata = {
    CompanyName: pck.author,
    FileDescription: "Clipboard app",
    OriginalFilename: pck.name,
    ProductName: "Clipboard app",
    InternalName: pck.name
};

var wpConfig = Object.create(webpackConfig);

function buildWinInstaller(arch) {
    console.log(`Building installer for Windows ${arch}...`);
    return winInstaller.createWindowsInstaller({
        appDirectory: `package/${pck.name}-win32-${arch}`,
        outputDirectory: `installer/${pck.name}-win32-${arch}`,
        authors: pck.author,
        title: metadata.ProductName,
        setupIcon: "resources/icon.ico",
        skipUpdateIcon: true,
        noMsi: true
    }).then(function() {
        console.log(`App installer builded for Windows ${arch}`);
    });
}

gulp.task("default", ["build"], function() {
    env.set({ ELECTRON_ENV: "development" });
    electron.start();
});

gulp.task("watch", ["build"], function () {
  env.set({ ELECTRON_ENV: "development" });
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

gulp.task('package-windows', ["build"], function () {
  env.set({ ELECTRON_ENV: "production" });
  pckOptions.icon = "resources/icon.ico";
  pckOptions.platform = "win32";
  pckOptions.win32metadata = metadata;
  packager(pckOptions, function done_callback (err, appPaths) {
      console.log("App packaged for Windows !");
      buildWinInstaller("x64")
  });
});

gulp.task('package-linux', ["build"], function () {
  env.set({ ELECTRON_ENV: "production" });
  pckOptions.icon = "resources/icon.ico";
  pckOptions.platform = "linux";
  packager(pckOptions, function done_callback (err, appPaths) {
      console.log("App packaged for Linux !");
  });
});

gulp.task('package-darwin', ["build"], function () {
  env.set({ ELECTRON_ENV: "production" });
  pckOptions.icon = "resources/icon.icns";
  pckOptions.platform = "darwin";
  packager(pckOptions, function done_callback (err, appPaths) {
      console.log("App packaged for OSX !");
  });
});

gulp.task('package', ["build"], function () {
  env.set({ ELECTRON_ENV: "production" });
  pckOptions.icon = "resources/icon";
  pckOptions.platform = "all";
  pckOptions.win32metadata = metadata;
  packager(pckOptions, function done_callback (err, appPaths) {
      console.log("App packaged for all platforms !");
  });
});
