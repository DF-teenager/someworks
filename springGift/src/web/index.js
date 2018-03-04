
/**
 * 上线时拷贝dist目录下生成的样式，并在./template.tpl引入对应脚本
 */
import $ from 'jquery';
import Handlebars from 'handlebars';
import '../assets/web.scss';

/**
 * 开发JS,上线直接拷贝一下内容到./template.tpl
 */
var YD = {},
    template;

YD.Template = function () {
    /** 变量 */
    this.$floor3Ele = $('.floor.floor3');
    this.$isLogin = $('#isLogin').val();
    this.$rankBtnEles = $('.ranking a.btn');
    this.$rankType = $('#rankType');
    this.$showRankType = 'day';
    this.$rankList = {};
    this.$rankListTemplate = $('#rank-list-template').html();
    this.$rankListTbody = $('#rankListTbody');
    this.$rankShopListEle = $('#rankShopList');
    this.$rankShopListTemplate = $('#rank-shop-list-template').html();
    this.$rankDayShopList = [{
        rank: 'NO.1',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/shop1.jpg',
        name: '九阳电火锅',
    }, {
        rank: 'NO.2',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/shop2.jpg',
        name: '九阳电火锅',
    }, {
        rank: 'NO.3',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/shop3.jpg',
        name: '九阳电火锅',
    }];
    this.$rankWeekShopList = [{
        rank: 'NO.1',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/week-shop1.jpg',
        name: '九阳电火锅',
    }, {
        rank: 'NO.2-3',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/week-shop2.jpg',
        name: '九阳电火锅',
    }, {
        rank: 'NO.4-5',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/week-shop3.jpg',
        name: '九阳电火锅',
    }];
    this.$rankTotalShopList = [{
        rank: 'NO.1',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/total-shop1.jpg',
        name: '九阳电火锅',
    }, {
        rank: 'NO.2-3',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/total-shop2.jpg',
        name: '九阳电火锅',
    }, {
        rank: 'NO.4-6',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/total-shop3.jpg',
        name: '九阳电火锅',
    }, {
        rank: 'NO.7-10',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/total-shop3.jpg',
        name: '九阳电火锅',
    }, {
        rank: 'NO.11-20',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/total-shop3.jpg',
        name: '九阳电火锅',
    }];

    /** 初始化 */
    this.init = function () {
        this.events();
        this.$rankdata();
        this.$rankShops(this.$rankDayShopList);
    };

    this.events = function () {
        /** 事件方法 */
        var self = this;
        self.$rankdata = function (data) {
            $.ajax({
                url: '/webapi/get_loan_rank',
                type: 'POST',
                data: data,
                success: function (res) {
                    var f = Handlebars.compile(self.$rankListTemplate);
                    self.$rankList = res.data;
                    Handlebars.registerHelper('islast', function (value, options) {
                        return self.$rankList.length - 1 === value ? options.fn(this) : null;
                    });
                    Handlebars.registerHelper('onrank', function (value) {
                        return value + 1;
                    });
                    self.$rankListTbody.html(f(self.$rankList));
                },
                error: function (res) {
                    alert(res);
                },
            });
        };
        self.$rankBtnEles.on('click', function () {
            var data = {},
                list;
            self.$rankBtnEles.removeClass('active');
            $(this).addClass('active');
            self.$showRankType = $(this).data('type');
            switch (self.$showRankType) {
                case 'day':
                    data = {
                        sign: 1,
                        date: '2018-03-04',
                    };
                    list = self.$rankDayShopList;
                    self.$showRankCon('floor floor3');
                    self.$rankType.text('日出借排行榜');
                    break;
                case 'week':
                    data = {
                        sign: 2,
                        type: 1,
                        date: '2018-03-04,2018-03-05',
                    };
                    list = self.$rankWeekShopList;
                    self.$showRankCon('floor floor3 week');
                    self.$rankType.text('七日出借排行榜');
                    break;
                case 'total':
                    data = {
                        sign: 3,
                        date: '2018-03-04',
                    };
                    list = self.$rankTotalShopList;
                    self.$showRankCon('floor floor3 total');
                    self.$rankType.text('总出借排行榜');
                    break;
                default: break;
            }
            self.$rankdata(data);
            self.$rankShops(list);
        });
        self.$rankShops = function (list) {
            var f = Handlebars.compile(self.$rankShopListTemplate);
            Handlebars.registerHelper('isfirst', function (value, options) {
                return self.$showRankType === 'total' && value === 0 ? options.fn(this) : null;
            });
            self.$rankShopListEle.html(f(list));
        };
        self.$showRankCon = function (classs) {
            self.$floor3Ele.removeClass();
            self.$floor3Ele.addClass(classs);
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
