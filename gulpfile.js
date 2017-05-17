var gulp = require("gulp"),
    electron = require("electron-connect").server.create(),
    ts = require("gulp-typescript"),
    webpack = require("webpack"),
    webpackConfig = require("./webpack.config.js"),
    packager = require('electron-packager'),
    env = require('gulp-env'),
    pck = require('./package.json'),
    winInstaller = require('electron-winstaller'),
    createDMG = require('electron-installer-dmg'),
    zip = require('gulp-zip'),
    path = require('path'),
    mkdirp = require('mkdirp');
    // debianInstaller = require('electron-installer-debian');

var tsProject = ts.createProject("tsconfig.json");

var pckOptions = {
    prune: true,
    overwrite: true,
    out: "package",
    dir: ".",
    name: pck.name,
    osxSign: true,
    appVersion: pck.version,
    ignore: function(filePath) {
        if (/node_modules/.test(filePath)) {
            if (/\/(obj|test.*?|spec.*?|htdocs|demo|example.*?|sample.*?)[\/$]/i.test(filePath)) {
                return true;
            }
            if (/^(\..*|.*\.(sln|pdb|exp|lib|map|md|sh|gypi|gyp|h|cpp|xml|yml|html)|vcxproj.*|LICENSE|README|CONTRIBUTORS|vagrant|Dockerfile|Makefile)$/i.test(path.basename(filePath))) {
                return true;
            }
        } else {
            if (/\/(package|installer|.git)[\/$]/i.test(filePath)) {
                return true;
            }
            console.log(filePath);
        }
    }
};

var metadata = {
    CompanyName: pck.author,
    FileDescription: "OhMyCB",
    OriginalFilename: pck.name,
    ProductName: "OhMyCB",
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
        noMsi: true,
        loadingGif: `resources/loader-installer.gif`
    }).then(function() {
        console.log(`App installer builded for Windows ${arch}`);
        gulp.src(`installer/${pck.name}-win32-${arch}/*`)
            .pipe(zip(`${pck.name}-win32-${arch}.zip`))
            .pipe(gulp.dest('installer'));
    });
}

function buildDarwinInstaller() {
    console.log(`Building installer for Darwin x64`);
    return createDMG({
        name: pck.name,
        appPath: `package/${pck.name}-darwin-x64/${pck.name}.app`,
        icon: "resources/icon.ico",
        overwrite: true,
        out: path.join(__dirname, `installer/${pck.name}-darwin`)
    }, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`Installer builded for Darwin x64`);
        }
    });
}

function buildDebianInstaller() {
    console.log(`Building installer for Debian x64`);
    return debianInstaller({
        src: `package/${pck.name}-linux-x64`,
        arch: 'amd64',
        dest: `installer/${pck.name}-linux-x64}`
    }, function(err) {
        console.log(`Installer builded for Debian x64`);
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
    //   buildDebianInstaller();
  });
});

gulp.task('package-darwin', ["build"], function () {
  env.set({ ELECTRON_ENV: "production" });
  pckOptions.icon = "resources/icon.icns";
  pckOptions.platform = "darwin";
  packager(pckOptions, function done_callback (err, appPaths) {
      console.log("App packaged for OSX !");
      mkdirp(`installer/${pck.name}-darwin`, function (err) {
          buildDarwinInstaller();
      });
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
