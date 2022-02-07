const {src, dest, parallel, series, watch} = require('gulp')
require('dotenv').config()
const sass = require('gulp-sass')
const notify = require('gulp-notify')
const rename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const fileinclude = require('gulp-file-include')
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')
const fs = require('fs')
const del = require('del')
const uglify = require('gulp-uglify-es').default
const gutil = require('gulp-util')
const rigger = require('gulp-rigger') // модуль для импорта содержимого одного файла в другой
const plumber = require('gulp-plumber') // модуль для отслеживания ошибок
const imagemin = require('gulp-imagemin') // плагин для сжатия PNG, JPEG, GIF и SVG изображений
const jpegrecompress = require('imagemin-jpeg-recompress') // плагин для сжатия jpeg
const pngquant = require('imagemin-pngquant') // плагин для сжатия png
const cache = require('gulp-cache') // модуль для кэширования
const getMeta = require("lets-get-meta")

let srcFonts = './src/scss/_fonts.scss'
var path = {
    production: {
        html: process.env.ENV ? process.env.PRODUCT_PATH + '' : 'build/',
        js: process.env.ENV ? process.env.PRODUCT_PATH + 'js/' : 'build/js/',
        css: process.env.ENV ? process.env.PRODUCT_PATH + 'css/' : 'build/css/',
        images: process.env.ENV ? process.env.PRODUCT_PATH + 'images/' : 'build/images/',
        fonts: process.env.ENV ? process.env.PRODUCT_PATH + 'fonts/' : 'build/fonts/',
        resources: process.env.ENV ? process.env.PRODUCT_PATH + 'resources/' : 'build/resources/',
    },
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        images: 'build/images/',
        fonts: 'build/fonts/',
        resources: 'build/resources/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/style/main.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        resources: 'src/resources/'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/style/**/*.css',
        //css: 'assets/src/style/**/*.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        resources: 'src/resources/**/*.*'
    },
    clean: './assets/build/*'
}

// Где то здесь подменяем папку для билдов

const fonts = () => {
    src('./src/fonts/**.ttf')
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src('./src/fonts/**.ttf')
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}

const cb = () => {}

const fontsStyle = (done) => {
    let file_content = fs.readFileSync(srcFonts)

    fs.writeFile(srcFonts, '', cb)
    fs.readdir(path.build.fonts, function (err, items) {
        if (items) {
            let c_fontname
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split('.')
                fontname = fontname[0]
                if (c_fontname != fontname) {
                    fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb)
                }
                c_fontname = fontname
            }
        }
    })

    done()
}

const styles = () => {
    return src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', notify.onError()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 1
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())
}

const htmlInclude = () => {
    return src(['./src/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

const images = () => {
    return src(path.src.images) // путь с исходниками картинок
        .pipe(dest(path.build.images)) // выгрузка готовых файлов
}

const resources = () => {
    return src('./src/resources/**')
        .pipe(dest(path.build.resources))
}

const clean = () => {
    return del(['build/*'])
}

const scripts = () => {
    return src(path.src.js) // получим файл main.js
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(dest(path.build.js))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.init()) //инициализируем sourcemap
        //.pipe(uglify()) // минимизируем js
        .pipe(sourcemaps.write('./')) //  записываем sourcemap
        .pipe(dest(path.build.js)) // положим готовый файл
        //.pipe(webserver.reload({ stream: true })); // перезагрузим сервер
        .pipe(browserSync.stream()) // перезагрузим сервер
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    })

    watch('./src/scss/**/*.scss', styles)
    watch('./src/**/*.html', htmlInclude)
    watch('./src/images/**.jpg', images)
    watch('./src/images/**.png', images)
    watch('./src/images/**.jpeg', images)
    watch('./src/images/**.svg', images)
    watch('./src/resources/**', resources)
    watch('./src/fonts/**.ttf', fonts)
    watch('./src/fonts/**.ttf', fontsStyle)
    watch('./src/js/**/*.js', scripts)
}

exports.styles = styles
exports.watchFiles = watchFiles
exports.fileinclude = htmlInclude

/////////////////////////////
// Генерация главной страницы со всеми страницами
/////////////////////////////

const {promises: fss} = require(`fs`)
const dree = require(`dree`)
const chalk = require(`chalk`)

const readFile = async (path, encoding = `utf-8`) => fss.readFile(path, {encoding})

const createFile = (path, data = ``) => fss.writeFile(path, data, `utf8`)

const createDirectory = path => fss.mkdir(path).catch(err => {
    if (err.code !== `EEXIST`) throw err
}).then(() => {})

const commonScss = () => {
    return src('./src/common/styles/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(dest('./build/common/'))
}
const commonImages = () => {
    return src(`./src/common/images/**/*.*`)
        .pipe(dest(`./build/common/images`))
}

const commonHtml = () => {

    console.log(`${chalk.bold(`Генерация списка страниц проекта...`)}`)

    let files = {
        html: [],
        globals: [],
        components: [],
        vendor: []
    }

    const tree = dree.scan('./src/', {
        depth: 3,
        stat: false,
        size: true,
        normalize: true,
        followLinks: true,
        exclude: [/fonts/, /images/],
        extensions: [`html`]
    }).children

    const html = tree.filter(item => item.type === `file` & item.extension === `html` && item.name !== `index.html`).map(item => {
        return {
            name: item.name,
            path: item.relativePath,
            type: item.extension
        }
    })

    var first_fields = [`home.html`]
    var last_fields = [`404.html`, `template.html`, `ui.html`]
    const aliases = {
        home: `Главная страница`,
        catalog: `Каталог`,
        404: `Страница не найдена`
    }

    files.html = html.filter(item => first_fields.includes(item.name)).concat(html.filter(item => !first_fields.includes(item.name) && !last_fields.includes(item.name))).concat(html.filter(item => last_fields.includes(item.name))).map((item, id) => {
        return {
            id, ...item
        }
    })

    const titles = files.html.map(async item => {
        const id = item.name.replace(`.html`, ``)
        const title = await readFile('./build/' + item.name, `utf-8`).then(data => {
            return (id in aliases) ? aliases[id] : data.includes(`<title>`) ? data.split(`<title>`)[1].split(`</title>`)[0] : 'Новая страница'
        })

        const figma = await readFile('./build/' + item.name, `utf-8`).then(data => {
            let meta = getMeta(data)
            return meta.figma
        })

        item.figma = (figma === 'undefined' || figma === undefined || figma === '@@figma') ? '' : '<a target="_blank" title="Макет на дизайн в figma" class="figma_maket" href="' + figma + '"></a>'
        item.title = title
    })

    Promise.all(titles).then(() => {
        tree.forEach(item => {

            const type = `globals`
            const title = item.name.charAt(0).toUpperCase() + item.name.replace(`.${item.extension}`, ``).slice(1).replace(`.min`, ``)

            if (!files[type].filter(file => file.title === title).length) {
                let result = {
                    title: type === `globals` ? `Новая страница` : title,
                    name: item.name
                }
                if (type === `globals`) {
                    result.title = `Новая страница`
                    result.path = item.relativePath
                    result.type = item.extension
                } else {
                    result = {
                        ...result,
                        [item.extension]: {
                            name: item.name,
                            path: item.relativePath
                        }
                    }
                }
                files[type].push(result)
            } else {
                files[type].filter(file => file.title === title)[0][item.extension] = {
                    name: item.name,
                    path: item.relativePath
                }
            }

        })

        files.components.sort((a, b) => a.title > b.title ? 1 : -1).map((item, id) => {
            item.id = id;
            [`js`, `css`].forEach(extension => {
                if (!item[extension]) {
                    item[extension] = {}
                    item[extension].name = item[extension].path = ``
                }

            })
        })

        tree.filter(item => item.type === `directory` && item.name === `vendor`).reduce((acc, val) => acc.concat(val.children), []).reduce((acc, val) => acc.concat(val.children), []).reverse().forEach(item => {

            const title = item.name.replace(/\.+(umd|min|concat)/g, ``).replace(/\.+(css|js)/g, ``),
                extension = item.name
            cw
            if (!files.vendor.filter(file => file.title.replace(/\.+(css|js)/g, ``) === title).length) {
                files.vendor.push({
                    title: `${title}.${item.extension}`,
                    type: item.extension
                })
            }

        })

        const jsonFiles = Object.keys(files).map(file => {
            if (file === 'html') {
                return createFile(`./src/common/data/${file}.json`, JSON.stringify(files[file]))
            } else {
                return true
            }
        })
        return true
    })

    return src(['./src/common/index.html'])
}

// Выносит инклуд html.json иначе если происходит быстрая сборка то файл туп не успевает собраться в задании commonHtml
const commonHtmlInclude = () => {
    const pjson = require(`./package.json`)
    return src(['./src/common/index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                title: pjson.name,
                name: pjson.name,
                description: pjson.description,
                repo: pjson.repository.url.replace(`.git`, ``),
                figma: pjson.figma.url.replace(`.git`, ``),
                copyright: ``
            }
        }))
        .pipe(dest('./build'))
        .pipe(browserSync.stream())
}
exports.generate = series(htmlInclude, commonHtml, commonScss, commonImages, commonHtmlInclude)

exports.default = series(clean, parallel(htmlInclude, scripts, fonts, resources, images), commonHtml, commonScss, commonImages, commonHtmlInclude, fontsStyle, styles, watchFiles)

const tinypng = () => {
    return src(path.src.images) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
            imagemin.gifsicle({interlaced: true}),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({plugins: [{removeViewBox: false}]})
        ])))
        .pipe(dest(path.build.images)) // выгрузка готовых файлов
}

const stylesBuild = () => {
    return src('./src/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', notify.onError()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 1
        }))
        .pipe(dest(path.build.css))
}

const scriptsBuild = () => {
    return src(path.src.js) // получим файл main.js
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(dest(path.build.js))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify()) // минимизируем js
        .pipe(dest(path.build.js)) // положим готовый файл
}

const imagesBuild = () => {
    return src(path.src.images) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
            imagemin.gifsicle({interlaced: true}),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            imagemin.svgo({plugins: [{removeViewBox: false}]})
        ])))
        .pipe(dest(path.build.images)) // выгрузка готовых файлов

    return src(['./src/images/**.svg', './src/images/**.jpg', './src/images/**.png', './src/images/**.jpeg'])
        .pipe(dest('./build/images'))
}

const cleanBuild = () => {
    // Меняем путь сохранения файлов для продакшена
    if (process.env.PRODUCT_PATH) {
        path.build = path.production
    }

    // Удаляем все что было в папке
    return del([path.build.html + 'css/*'], {force: true})
}

const copyRobotsBuild = () => {
    // копируем robots.txt в папку с html чтобы поисковики не индексировали страницы html
    return src(['./src/common/robots.txt'])
        .pipe(dest('./build'))
}

const test = () => {
    // Меняем путь сохранения файлов для продакшена
    console.log(path)
}
exports.test = test

// Пока что компилируем только css images и resources
exports.buildimages = series(cleanBuild, parallel(resources, imagesBuild), stylesBuild, tinypng)
exports.build = series(cleanBuild, parallel(htmlInclude, copyRobotsBuild, scriptsBuild, fonts, resources, imagesBuild), commonHtml, commonScss, commonImages, commonHtmlInclude, fontsStyle, stylesBuild, tinypng)
