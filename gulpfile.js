// Gulp API
const { src, dest, watch, series, parallel }    = require('gulp');

// Gulp packages
var gulp                = require('gulp');
var sass                = require('gulp-sass')(require('sass'));
// Browser Sync
var browserSync         = require("browser-sync").create();
// 
//  On rajoute la production
// 
// const plumber           = require('gulp-plumber');
// const autoprefixer      = require('gulp-autoprefixer');
// const csso              = require ('gulp-csso');
// On purge bootstrap
// const purgecss          = require('gulp-purgecss');
//  On valide html
// var valideHtml          = require('gulp-html');

// 
//  Dévellopemment
// 
// Files
const files = {
  sass_src_path:    './scss/**/*.scss',
  css_src_path:     'style.css',
  css_src_path_purge:     './*.css',
  css_dest_public:  './',
};

async function sassDevTask() {
    return src(files.sass_src_path)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(dest(files.css_dest_public))
        .pipe(browserSync.stream())
};

//  On check la sortie 
async function watchDevTask() 
  {
    browserSync.init({
      server: "./"
  });
  watch([files.sass_src_path],
    {
      intervall: 750, usePolling: true},
      series(
          parallel(sassDevTask),
      )
  );
  watch('/*.html').on('change',browserSync.reload);
};


exports.default = series( parallel(sassDevTask), watchDevTask,);

// 
//  Production
// 
// On finalise le css
async function prodCss() {
  return src(files.css_src_path)
    .pipe(plumber())
    .pipe(autoprefixer())
    .pipe (csso())
    .pipe(dest(files.css_dest_public))
  }
  exports.prod = series( parallel(prodCss));
  // 
  // On purge le css
async function purgeCss() {
  return src(files.css_src_path_purge)
    .pipe(purgecss({
      content: ['**/*.html'],
      variables: true,
      fontFace: true,
      keyframes: true,
  }))
  // .pipe(purgecss({
    //   ml_src_path: './*.html',
    // }))
    .pipe(dest(files.css_dest_public))
  }
  exports.purge = series( parallel(purgeCss));