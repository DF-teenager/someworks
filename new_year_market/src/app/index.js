/**
 * jax采用zepto.ajax
 * 上线时拷贝dist目录下生成的样式，并在./template.tpl引入对应脚本
 */
import $ from 'exports-loader?zepto!script-loader';
import Vue from 'vue/dist/vue';
import Router from 'vue-router';
import '../assets/app.scss';

Vue.use(Router)

/**
 * 使用ES5写法，上线时直接拷贝以下内容到./template.tpl
 * this is a mark line(以此线为标准，autocopy脚本会自动拷贝其之后的代码)
 */

var home = Vue.extend({
    template: '#home',
    data: function() {
        return {
            page_show: 0,
            animationPlayState: 'paused',
            isDoorZoomOut: false,
            cantakeNum: 3,
            couponIds: [],
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
                
            ]
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
        }
    },
    mounted: function() {
        if(!this.show_progress) {
            this.page_show = 1;
        }
    },
    directives: {
        animation: {
            bind: function(el, binding, vnode) {
                var event = binding.arg;
                var fn = binding.value;
                el.addEventListener(event, fn);
            }
        }
    },
    methods: {
        gomarket: function() {

            var self = this;
            var snowing = self.$refs.snowing;

            self.animationPlayState = "running";
            snowing.addEventListener("webkitAnimationEnd", function(){
                // 动画结束
                self.isDoorZoomOut = true;
                setTimeout(function(){
                    self.page_show = 2;
                }, 1500)
            }), true;
        },
        handleCheckedCoupon: function(index) {

            var self = this;

            self.marketCoupons.forEach(function(ele, idx, arr){
                if(idx === index) {
                    if(self.couponIds.length <= 2 || arr[index].checked) {
                        arr[idx].checked = !arr[idx].checked;
                        var pos = self.couponIds.indexOf(arr[idx].id);
                        pos === -1 ? self.couponIds.push(arr[idx].id) : self.couponIds.splice(pos, 1);
                    } else {
                        console.log('您可选的年货数量已用完如果想要重新选择直接点击不满意的年货即可～');
                    }
                }
            });
            console.log(self.couponIds);
            
        }
    }
})
var records = Vue.extend({
    template: '#records',
    data: function() {
        return {

        }
    }
})
Vue.component('v-dialog', {
    template: '#dialog',
    props: {
        showDialog: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {

        }
    },
    methods: {
        cancelDialog: function() {

        }
    }
})
var routes = [{
        name: 'home', path: '/', component: home
    },{   
        name: 'records', path: '/records', component: records
    }]
var router = new Router({
    routes: routes
})
new Vue({
    router: router,
    data: function() {
        return {
            count: 0,
            show_progress: true,
            progress_percent: 0,
            imgs: [
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2017/12/year_sign/progress.jpg',
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