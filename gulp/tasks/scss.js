import dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";

import cleanCss from "gulp-clean-css"; //сжатие css файла
import webpcss from "gulp-webpcss"; //вывод webp картинок
import autoprefixes from "gulp-autoprefixer"; //добавление кроссбраухерных префиксов
import groupCssMediaQueries from "gulp-group-css-media-queries"; //группировка медиазапросов

const sass = gulpSass(dartSass);

export const scss = () => {
    return (
        app.gulp
            .src(app.path.src.scss, {
                sourcemaps: app.isDev,
            })
            .pipe(
                app.plugins.plumber(
                    app.plugins.notify.onError({
                        title: "SCSS",
                        message: "Error: <%= error.message %>",
                    })
                )
            )
            .pipe(app.plugins.replace(/@img\//g, "../img/"))
            .pipe(
                sass({
                    outputStyle: "expanded",
                })
            )
            .pipe(
                app.plugins.if(
                    app.isBuild,
                    groupCssMediaQueries(),
                    webpcss({
                        webpClass: ".webp",
                        noWebpClass: ".no-webp",
                    }),
                    autoprefixes({
                        grid: true,
                        overrideBrowserlist: ["last 3 versions"],
                        cascade: true,
                    }),
                    cleanCss()
                )
            )
            //раскомментировать если нужен несжатый дубль css файла
            // .pipe(app.gulp.dest(app.path.build.css))
            .pipe(
                rename({
                    extname: ".min.css",
                })
            )
            .pipe(app.gulp.dest(app.path.build.css))
            .pipe(app.plugins.browsersync.stream())
    );
};
