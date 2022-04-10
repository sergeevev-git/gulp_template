// основной модуль
import gulp from "gulp";

// импорт путей
import { path } from "./gulp/config/path.js";
// импорт плагинов
import { plugins } from "./gulp/config/plugins.js";

// импорт задач
import { copy } from "./gulp/tasks/copy.js";
import { html } from "./gulp/tasks/html.js";
import { reset } from "./gulp/tasks/reset.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
import { spriteSvg } from "./gulp/tasks/spriteSvg.js";
import { zip } from "./gulp/tasks/zip.js";
import { ftp } from "./gulp/tasks/ftp.js";

// передавем знач в глоб переменную
global.app = {
    isBuild: process.argv.includes("--build"),
    isDev: !process.argv.includes("--build"),
    path: path,
    gulp: gulp,
    plugins: plugins,
};

// наблюдатель за изменениями в файлах
function watcher() {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html);
    // gulp.watch(path.watch.html, gulp.series(html,ftp)); сразу будет улетать на фтп
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);
}

// построение сценариев выполнения задач

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

//parallel - параллельно
const mainTasks = gulp.series(
    fonts,
    gulp.parallel(fonts, copy, html, scss, js, images)
);

// построение сценариев выполнения задач
//series - последовательно
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

export { spriteSvg, dev, build, deployZIP, deployFTP };
// сценарий по дефолту
gulp.task("default", dev);
