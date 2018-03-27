/**
 * Created by LHammer on 18/01/09.
 * build时autocopy脚本会自动拷贝dist目录下生成文件到template.tpl
 */
import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router';
// import axios from '../api/index';
import '../assets/app.scss';

Vue.use(VueRouter);
// Vue.prototype.$axios = axios;

const home = Vue.extend({
    template: '#home',
    data() {
        return {
            showPage: 0,
            redpacketTypes: Array.from({ length: 7 }),
            redpackets: [1, 2, 3, 4, 5, 6, 7],
            ariaControls: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        };
    },
    computed: {
        showProgress: function () {
            return this.$root.showProgress;
        },
    },
    created() {

    },
    watch: {
        showProgress: function (value) {
            if (!value) {
                this.showPage = 1;
            }
        },
        showPage: function (value) {
            if (value === 2) {
                document.body.scrollHeight > window.innerHeight ? document.body.scrollTop = document.body.scrollHeight : null;
            }
        },
    },
});
new Vue({
    data() {
        return {
            count: 0,
            showProgress: false,
            progressPercent: 60,
            cacheImgs: [],
            imgs: [
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-1-1s.jpg',
            ],
        };
    },
    router: new VueRouter({
        routes: [
            {
                name: 'home',
                path: '/',
                component: home,
                meta: {
                    page: 1,
                },
            },
        ],
    }),
    mounted: function () {
        var self = this;
        self.imgs.forEach(function (url, idx) {
            self.cacheImgs[idx] = new Image();
            self.cacheImgs[idx].onload = function () {
                self.count += 1;
                Math.floor(self.count / self.imgs.length) * 100 + '%';
            };
            self.cacheImgs[idx].src = url;
        });
    },
    watch: {
        // count: function (val) {
        //     var self = this,
        //         per = val / self.imgs.length;
        //     self.progressPercent = Math.floor(per * 100);
        //     if (per === 1) {
        //         setTimeout(function () {
        //             self.showProgress = true;
        //         }, 10);
        //     }
        // },
    },
}).$mount('#app');

/**
 * 热模块替换，开发环境使用
 */
if (module.hot) {
    module.hot.accept();
}
