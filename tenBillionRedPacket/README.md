<br><br>
<p align="center">
    <a href="https://getbootstrap.com/">
        <img src="./static/construction.jpeg" width="99">
    </a>
    <h3 align="center">YDTemplate</h3>
    <p align="center">
        <img src="https://travis-ci.org/l-hammer/YDTemplate.svg?branch=master">
        <a href="https://github.com/l-hammer/YDTemplate/issues"><img src="https://img.shields.io/github/issues/l-hammer/YDTemplate.svg"></a>
        <img src="https://img.shields.io/badge/devDependencies-up%20to%20date-blue.svg">
        <a href="https://github.com/l-hammer/YDTemplate/blob/master/LICENSE"><img src="https://img.shields.io/github/license/l-hammer/YDTemplate.svg"></a>
    </p>
    <p align="center">
        Yindou Web and App special development template~
        <br>
    </p>
</p>

## Quick start

Several quick start options are available:

- Initialize template run: `. init.sh`
- Clone the repo: `https://github.com/l-hammer/YDTemplate.git`
- Install dependencies with [npm](https://www.npmjs.com/): `npm install`
- Web development run ~~`npm run webdev`~~ `npm run webstart`
- App development run ~~`npm run appdev`~~ `npm run appstart`
- Open web example run ~~`npm run webegdev`~~ `npm run webegstart`
- Open app example run ~~`npm run appegdev`~~ `npm run appegstart`
- Build run `bash build.sh @param1 @param2` (@param1:`web`,`app`,`webeg`,`appeg`; @param2:`--no-minify`)
- Move useless codes run `python bin/mvuseless.py @param` (@param:`web`,`app`,`examples`)
- Open `http://localhost:1234` in your browser.

## What's included

```
YDTemplate/
├── bin/    // python脚本
│   ├── autocopy.py    // 🚚自动拷贝上线代码
│   └── mvuseless.py    // 🚚删除开发非相关代码for强迫症用户
├── server/
│   └── index.js    // 💡node proxy
├── configs/
│   └── init.ini    // 🎉初始化配置
├── src/
│   ├── api/
│   │   ├── config.js/    // axios配置
│   │   └── app/    // 业务API
│   ├── assets/
│   │   ├── normalize/
│   │   │   └── index.scss    // 统一浏览器默认样式
│   │   ├── iconfonts/
│   │   │   └── index.scss    // 内联字体&&字体图标
│   │   ├── animation/
│   │   │   └── index.scss    // 常用css动画
│   │   ├── mixins/
│   │   │   └── index.scss    // 可重用的代码块@mixin
│   │   ├── components/
│   │   │   └── index.scss    // 常用组件样式@dialog
│   │   ├── app.scss    // app开发样式入口
│   │   └── web.scss    // web开发样式入口
│   ├── examples/
│   │   ├── web/    // web examples
│   │   └── app/    // app examples
│   ├── app/
│   │   ├── index.html    // app开发页
│   │   ├── index.js    // app开发脚本
│   │   └── template.tpl    // 上线模板
│   │── web/
│   │   ├── index.html    // web开发页
│   │   ├── index.js    // web开发脚本
│   │   └── template.tpl    // web上线模板
│   └── utils/    // 🗃常用工具函数
├── clearcache.sh    // ♻️清除缓冲
├── build.sh    // 📦打包
└── push.sh    // 🔥强烈建议使用此脚本替换git push
```
## Technology

- App `Vue 2.x` + `Axios`
- Web `Jquery` + `handlebars`

## Browser Support

```
last 10 versions
IE 8
iOS 7
```

## Contributing

- :fork_and_knife:Fork it!
- :wrench:Create your branch: `git checkout -b new-branch`
- :memo:Commit your changes: `git commit -am 'Add some feature'`
- :rocket:Push to the branch: `git push origin new-branch`
- :tada:Submit a pull request

## License

[MIT](https://github.com/l-hammer/YDTemplate/blob/master/LICENSE) © 2018 LHammer

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fl-hammer%2FYDTemplate.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fl-hammer%2FYDTemplate?ref=badge_large)