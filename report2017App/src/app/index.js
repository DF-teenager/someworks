/**
 * jax采用zepto.ajax
 * 上线时拷贝dist目录下生成的样式，并在./template.tpl引入对应脚本
 */
import $ from 'jquery';
import 'fullpage.js';
import '../assets/app.scss';

/**
 * 使用ES5写法，上线时直接拷贝以下内容到./template.tpl
 * this is a mark line(以此线为标准，autocopy脚本会自动拷贝其之后的代码)
 */

var YD = {};
var template;
var $el;

YD.Template = function () {
    /** 变量 */
    this.$anchorLinks = ['section-01', 'section-02', 'section-03', 'section-04', 'section-05', 'section-06', 'section-07', 'section-08', 'section-09', 'section-10', 'section-11', 'section-12', 'section-13', 'section-14', 'section-15', 'section-16'];
    this.$nextPage = $('#nextPage');
    /** 初始化 */
    this.init = function () {
        var self = this;
        self.events();
        if (!$('html').hasClass('fp-enabled')) {
            $('#fullpage').fullpage({
                anchors: self.$anchorLinks,
                afterLoad: function (anchorLink, index) {
                    $el = $('.' + anchorLink + ' .animated');
                    $el.each(function (i, item) {
                        var dataAn = $(item).attr('data-an');
                        var dataDelay = $(item).attr('data-delay');
                        $(item).css({ 'animation-delay': dataDelay + 's', '-webkit-animation-delay': dataDelay + 's', '-moz-animation-delay': dataDelay + 's', '-ms-animation-delay': dataDelay + 's' }).addClass(dataAn).css('opacity', '1');
                        item.id === 'path_light' ? $(item).attr('class', 'animated ringRotate') : null;
                    });
                    index === 16 ? self.$nextPage.hide() : self.$nextPage.show();
                },
                onLeave: function () {
                    var $anEl = $('.animated');
                    $anEl.each(function (j, item) {
                        var dataAn = $(item).attr('data-an');
                        $(item).css('opacity', '0').removeClass(dataAn);
                        item.id === 'path_light' ? $(item).attr('class', 'animated') : null;
                    });
                },
            });
        }
    };

    this.events = function () {
        /** 事件方法 */
        var self = this;
        self.$nextPage.on('click', function () {
            $.fn.fullpage.moveSectionDown();
        });
    };
};

template = new YD.Template();
template.init();

/**
 * 热模块替换，开发环境使用
 */
if (module.hot) {
    module.hot.accept();
}
