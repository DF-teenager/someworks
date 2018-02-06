/**
 * jax采用zepto.ajax
 * 上线时拷贝dist目录下生成的样式，并在./template.tpl引入对应脚本
 */
// import $ from 'exports-loader?zepto!script-loader';
import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router';
import '../assets/app.scss';

Vue.use(VueRouter)

/**
 * 使用ES5写法，上线时直接拷贝以下内容到./template.tpl
 * this is a mark line(以此线为标准，autocopy脚本会自动拷贝其之后的代码)
 */

var home = Vue.extend({
    template: '#home',
    data: function() {
        return {
            page_show: 0,
            animationPlayState: false,
            isDoorZoomOut: false,
            couponIds: [],
            lotteryNum: 0,
            couponNum: 0,
            isBind: true, // 绑定状态
            marketCoupons: [
                { id: 1, value: 2000, name: '现金卡', firstBit: '2', plusBit: '000', unit: '元', checked: false },
                { id: 2, value: 50, name: '现金券', firstBit: '5', plusBit: '0', unit: '元', checked: false },
                { id: 3, value: 100, name: '现金券', firstBit: '1', plusBit: '00', unit: '元', checked: false },
                { id: 4, value: 200, name: '现金券', firstBit: '2', plusBit: '00', unit: '元', checked: false },
                { id: 5, value: 300, name: '现金券', firstBit: '3', plusBit: '00', unit: '元', checked: false },
                { id: 6, value: 500, name: '现金券', firstBit: '5', plusBit: '00', unit: '元', checked: false },
                { id: 7, value: 600, name: '现金券', firstBit: '6', plusBit: '00', unit: '元', checked: false },
                { id: 8, value: 800, name: '现金券', firstBit: '8', plusBit: '00', unit: '元', checked: false },
                { id: 9, value: 400, name: '现金券', firstBit: '4', plusBit: '00', unit: '元', checked: false },
                { id: 10, value: 1000, name: '现金券', firstBit: '1', plusBit: '000', unit: '元', checked: false },
                { id: 11, value: '1%', name: '加息券', firstBit: '1', plusBit: '', unit: '%', checked: false },
                { id: 12, value: 1500, name: '现金券', firstBit: '1', plusBit: '500', unit: '元', checked: false }
            ],
            dialogs: {
                bind: {
                    open: false
                },
                reTake: {
                    open: false
                },
                taked: {
                    open: false
                },
                unTake: {
                    open: false
                },
                noTake: {
                    open: false
                },
                rules: {
                    open: false
                }
            },
        }
    },
    computed: {
        show_progress: function() {
            return this.$root.show_progress;
        },
        doorZoomOut: function() {
            return {
                doorZoomOut: this.isDoorZoomOut
            }
        }
    },
    watch: {
        show_progress: function(value){
            if(!value) {
                this.page_show = 1;
            }
        },
        page_show: function(value) {
            if(value === 2) {
                // window.scrollTo(0, document.body.scrollHeight);
                document.body.scrollHeight > window.innerHeight ? document.body.scrollTop = document.body.scrollHeight : null;
            }
        }
    },
    created: function() {
        this.takeCouponNum();
    },
    mounted: function() {
        if(!this.show_progress) {
            this.page_show = this.$route.meta.page;
        }
    },
    // directives: {
    //     animation: {
    //         bind: function(el, binding, vnode) {
    //             var event = binding.arg;
    //             var fn = binding.value;
    //             el.addEventListener(event, fn);
    //         }
    //     }
    // },
    methods: {
        gomarket: function() {

            var self = this;
            var snowing = self.$refs.snowing;
            
            if(self.isBind) {
                self.animationPlayState = true;
                snowing.addEventListener("webkitAnimationEnd", function(){
                    // 动画结束
                    self.isDoorZoomOut = true;
                    setTimeout(function(){
                        self.page_show = 2;
                    }, 1500)
                }, false);
            } else {
                self.dialogs.bind.open = true;
            }
        },
        handleCheckedCoupon: function(index) {

            var self = this;

            self.marketCoupons.forEach(function(ele, idx, arr){
                if(idx === index) {
                    if(self.lotteryNum > 0 && self.couponIds.length < self.lotteryNum || arr[index].checked) {
                        arr[idx].checked = !arr[idx].checked;
                        var pos = self.couponIds.indexOf(arr[idx].id);
                        pos === -1 ? self.couponIds.push(arr[idx].id) : self.couponIds.splice(pos, 1);
                    } else if(self.lotteryNum === 0) {
                        // self.dialogs.noTake.open = true;
                        self.page_show = 3;
                    } else {
                        self.dialogs.reTake.open = true;
                    }
                }
            });
            self.couponNum = self.couponIds.length;
        },
        goBind: function(){
            window.location.href='/wx/index?goto_url=<{$g_www_domain}>/wx/supermarket';
        },
        closeDialog: function(name) {

            var self = this;

            if(name =="taked") {
                self.marketCoupons.forEach(function(ele, idx, arr){
                    arr[idx].checked = false;
                });
                self.couponIds = [];
                self.takeCouponNum();
            }
            self.dialogs[name].open = false;
        },
        goMineCoupon: function() {
            router.push({name: 'records', params: {page: 2}});
        },
        // 获取今日领取年货剩余次数
        takeCouponNum: function() {
            
            var self = this;
            var data = {
                act:'getnum',     
            }
            
            $.ajax({
                type: 'POST',
                url: '/webapi/action_supermarket',
                data: data,
                success: function(res) {
                    if(res.code === 0) {
                        self.isBind = true;
                        self.lotteryNum = res.data.lottery_num;
                    } else if(res.code === 400135) {
                        self.isBind = false;
                    } else {
                        alert(res.message);
                    }
                },
                error: function(error) {
                    alert(error);
                }
            })
        },
        // 免费拿走
        takeWantCoupon: function() {

            var self = this;
            var data = {
                act:'take',
                goods_id: self.couponIds.join(','),       
            }
            
            if(self.couponIds.length > 0){
                $.ajax({
                    type: 'POST',
                    url: '/webapi/action_supermarket',
                    data: data,
                    success: function(res) {
                        if(res.code === 0) {
                            self.dialogs.taked.open = true;
                        } else {
                            alert(res.message);
                        }
                    },
                    error: function(error) {
                        alert(error);
                    }
                })
            } else if(self.lotteryNum === 0) {
                self.page_show = 3;
            } else {
                self.dialogs.unTake.open = true;
            }
        }
    }
})
var records = Vue.extend({
    template: '#records',
    data: function() {
        return {
            coupons: []
        }
    },
    created: function() {
        this.getRecords();
    },
    methods: {
        /**
         * 获取年货记录
         */
        getRecords: function() {
            
            var self = this;
            var data = {
                act:'list',
            }

            $.ajax({
                type: 'POST',
                url: '/webapi/action_supermarket',
                data: data,
                success: function(res) {
                    if(res.code === 0) {
                        self.coupons = res.data;
                    } else {
                        alert(res.message);
                    }
                },
                error: function(error) {
                    alert(error);
                }
            })
        },
    },
    beforeRouteLeave: function(to, from, next) {
        to.meta.page = from.params.page;
        next();
    }
})
Vue.component('v-dialog', {
    template: '#dialog',
    props: {
        name: String,
        showDialog: {
            type: Boolean,
            default: false
        },
        icon: {
            type: Boolean,
            default: false
        },
        isBtn: {
            type: Boolean,
            default: false
        },
        isBindBtn: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {

        }
    },
    methods: {
        closeDialog: function() {
            this.$emit('close-dialog', this.name);
        },
        globalCloseDialog: function() {
            this.$emit('global-close-dialog');
        },
        bindDialog: function() {
            this.$emit('bind-dialog');
        }
    }
});
var routes = [{
        name: 'home', 
        path: '/', 
        component: home,
        meta: {
            page: 1
        }
    },{   
        name: 'records', 
        path: '/records/:page', 
        component: records
    }]
var router = new VueRouter({
    routes: routes
})
var app = new Vue({
    router: router,
    data: function() {
        return {
            count: 0,
            show_progress: true,
            progress_percent: 0,
            imgs: [
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/snowingbig.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-1-1s.jpg',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/girl-gomarket-sprites-min.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-1-2.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-1ss.jpg',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-2s.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-3.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-4.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-4-mask.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-3-mask.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-3-1s.jpg',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-3-3.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-3-4.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-4-1s.jpg',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/dialog-1.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/dialog-2.png'
            ]
        }
    },
    mounted: function(){
        var self = this;
        self.imgs.forEach(function(url){
            var img = new Image();
            img.onload = function(){
                self.count++;
            };
            img.src = url;
        })
    },
    watch: {
        count: function(val){
            var self = this,
                per = val/self.imgs.length;
            self.progress_percent = Math.floor(per * 100);
            if(per===1){
                setTimeout(function(){
                    self.show_progress = false;
                }, 100)
            }
        }
    }
}).$mount('#app');

/**
 * 热模块替换，开发环境使用
 */
if (module.hot) {
    module.hot.accept();
}