
/**
 * 上线时拷贝dist目录下生成的样式，并在./template.tpl引入对应脚本
 */
import $ from 'jquery';
import '../assets/web.scss';

/**
 * 开发JS,上线直接拷贝一下内容到./template.tpl
 */
var YD = {},
    template;

YD.Template = function () {
    /** 变量 */
    this.$isLogin = $('#isLogin').val();

    /** 初始化 */
    this.init = function () {
        this.events();
        this.$rankdata();
    };

    this.events = function () {
        /** 事件方法 */
        var self = this;
        self.$rankdata = function () {
            $.ajax({
                url: '/webapi/get_loan_rank',
                type: 'POST',
                success: function (res) {
                    var result = $.parseJSON(res);
                    console.log(result);
                },
                error: function (res) {
                    alert(res);
                },
            });
        };
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
