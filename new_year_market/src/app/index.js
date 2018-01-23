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
    computed: {
        show_progress:function(){
            return this.$root.show_progress;
        }
    },
    data: function() {
        return {
            page_show:0,
        }
    },
    watch: {
        show_progress: function(value){
            if(!value){
                this.page_show = 1;
            }
        }
    },
    mounted: function(){
        if(!this.show_progress){
            this.page_show = 1;
        }
    },
    methods: {

    }
})
var records = Vue.extend({
    template: '#records',
    data: function() {
        return {

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