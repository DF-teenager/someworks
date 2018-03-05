
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
    this.$isLogin = $('#isLogin').val();
    this.$unLoginBtn = $('.unLogin');
    this.$floor3Ele = $('.floor.floor3');
    this.$isLogin = $('#isLogin').val();
    this.$selectSelection = $('.at-select__selection');
    this.$selectDropdown = $('.at-select__dropdown');
    this.$iconArrowDown = $('.yds-icon-arrow-down-b');
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
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/total-shop4.jpg',
        name: '九阳电火锅',
    }, {
        rank: 'NO.11-20',
        src: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/spring_gift/pc/total-shop5.jpg',
        name: '九阳电火锅',
    }];
    this.$selectSelected = $('#selectSelected');
    this.$selectListEle = $('#selectList');
    this.$selectListTemplate = $('#select-list-template').html();
    this.$selectList = [{
        date_cn: '3月9日',
        date: '2018-03-09',
    }, {
        date_cn: '3月10日',
        date: '2018-03-10',
    }, {
        date_cn: '3月11日',
        date: '2018-03-11',
    }, {
        date_cn: '3月12日',
        date: '2018-03-12',
    }, {
        date_cn: '3月13日',
        date: '2018-03-13',
    }, {
        date_cn: '3月14日',
        date: '2018-03-14',
    }, {
        date_cn: '3月15日',
        date: '2018-03-15',
    }, {
        date_cn: '3月16日',
        date: '2018-03-16',
    }, {
        date_cn: '3月17日',
        date: '2018-03-17',
    }, {
        date_cn: '3月18日',
        date: '2018-03-18',
    }, {
        date_cn: '3月19日',
        date: '2018-03-19',
    }, {
        date_cn: '3月20日',
        date: '2018-03-20',
    }, {
        date_cn: '3月21日',
        date: '2018-03-21',
    }, {
        date_cn: '3月22日',
        date: '2018-03-22',
    }];
    this.$selectWeekList = [{
        type: 1,
        date_cn: '3月9日 - 3月15日',
    }, {
        type: 2,
        date_cn: '3月16日 - 3月22日',
    }];
    this.$rankArgs = {
        sign: 1,
        type: 1,
        date: new Date(new Date().getTime()).toISOString().split('T')[0],
    };

    /** 初始化 */
    this.init = function () {
        this.events();
        this.$getRankData(this.$rankArgs);
        this.$handleRankShops(this.$rankDayShopList);
        this.$handleSelectList(this.$selectList);
    };

    this.events = function () {
        /** 事件方法 */
        var self = this;
        self.$unLoginBtn.on('click', function () {
            YD.showLogin();
        });
        self.selectDropdownToggleClass = function () {
            self.$selectDropdown.toggleClass('slideDownInGrow');
            self.$iconArrowDown.toggleClass('reverse');
        };
        document.addEventListener('click', function ($eve) {
            var contains = $.contains(self.$selectSelection.get(0), $eve.target);
            if (!contains) {
                self.$selectDropdown.removeClass('slideDownInGrow');
                self.$iconArrowDown.removeClass('reverse');
            }
        });
        self.$selectSelection.on('click', function () {
            self.selectDropdownToggleClass();
        });
        self.$today = function () {
            var cur = new Date(new Date().getTime()).toISOString().split('T')[0];
            return cur.slice(5).replace(/0/g, '').replace('-', '月') + '日';
        };
        self.$week = function () {
            return self.$today().slice(2, -1) * 1 > 15 ? '3月9日 - 3月15日' : '3月16日 - 3月22日';
        };
        self.$getRankData = function (data) {
            // if (self.$isLogin) {
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
            // } else {
            //     YD.showLogin();
            // }
        };
        self.$rankBtnEles.on('click', function () {
            var list;
            self.$rankBtnEles.removeClass('active');
            $(this).addClass('active');
            self.$showRankType = $(this).data('type');
            switch (self.$showRankType) {
                case 'day':
                    self.$rankArgs = {
                        sign: 1,
                        date: self.$today(),
                    };
                    list = self.$rankDayShopList;
                    self.$showRankCon('floor floor3');
                    self.$rankType.text('日出借排行榜');
                    self.$handleSelectList(self.$selectList);
                    break;
                case 'week':
                    self.$rankArgs = {
                        sign: 2,
                        type: 1,
                    };
                    list = self.$rankWeekShopList;
                    self.$showRankCon('floor floor3 week');
                    self.$rankType.text('七日出借排行榜');
                    self.$handleSelectList(self.$selectWeekList);
                    self.$selectSelected.text(self.$week());
                    break;
                case 'total':
                    self.$rankArgs = {
                        sign: 3,
                    };
                    list = self.$rankTotalShopList;
                    self.$showRankCon('floor floor3 total');
                    self.$rankType.text('总出借排行榜');
                    self.$selectSelection.hide();
                    break;
                default: break;
            }
            self.$getRankData(self.$rankArgs);
            self.$handleRankShops(list);
        });
        self.$selectListEle.on('click', function ($eve) {
            var dateCn = $($eve.target).text();
            self.$rankArgs.date = $($eve.target).data('date');
            $($eve.target).data('type') ? self.$rankArgs.type = $($eve.target).data('type') : null;
            self.$selectSelected.text(dateCn);
            self.selectDropdownToggleClass();
            self.$getRankData(self.$rankArgs);
        });
        self.$handleRankShops = function (list) {
            var f = Handlebars.compile(self.$rankShopListTemplate);
            Handlebars.registerHelper('isfirst', function (value, options) {
                return self.$showRankType === 'total' && value === 0 ? options.fn(this) : null;
            });
            self.$rankShopListEle.html(f(list));
        };
        self.$handleSelectList = function (data) {
            if (data) {
                var f = Handlebars.compile(self.$selectListTemplate);
                self.$selectListEle.html(f(data));
                self.$selectSelected.text(self.$today());
            }
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
