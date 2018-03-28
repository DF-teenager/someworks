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

Vue.component('v-dialog', {
    template: '#dialog',
    props: {
        name: String,
        showDialog: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog', this.name);
        },
        globalCloseDialog() {
            this.$emit('globalCloseDialog');
        },
    },
});
const home = Vue.extend({
    template: '#home',
    data() {
        return {
            showPage: 0,
            redpackets: [
                { type: 1, aria: 1, rotate: 25, active: false },
                { type: 2, aria: 2, rotate: 25, active: false },
                { type: 3, aria: 3, rotate: 25, active: false },
                { type: 4, aria: 4, rotate: -25, active: false },
                { type: 5, aria: 5, rotate: 25, active: false },
                { type: 6, aria: 6, rotate: 0, active: false },
                { type: 7, aria: 7, rotate: 25, active: false },
            ],
            dialogs: {
                grab: {
                    open: false,
                },
                countdown: {
                    open: false,
                },
                timeover: {
                    open: true,
                },
            },
            unStart: false,
            unStartMsg: false,
            countdowns: {
                begin: 3,
                play: 8,
            },
        };
    },
    computed: {
        showProgress: function () {
            return this.$root.showProgress;
        },
        preRedpackets: function () {
            const redPacketRotates = [25, 0, -25];
            const redPacketTypes = Array.from({ length: 7 }).map((v, i) => i + 1);
            const simpleType = () => redPacketTypes[Math.floor(Math.random() * redPacketTypes.length)];
            const simpleRotate = () => redPacketRotates[Math.floor(Math.random() * redPacketRotates.length)];
            const zipObject = (props, values) => props.reduce((obj, prop, index) => {
                const o = (obj[prop] = values[index], obj);
                return o;
            }, {});

            return Array.from({ length: 12 }).map((v, i) => {
                return zipObject(['type', 'aria', 'rotate', 'active'], [simpleType(), i + 8, simpleRotate(), false]);
            });
        },
    },
    created() {
        console.log(this.preRedpackets);
    },
    methods: {
        remove(arr, func) {
            Array.isArray(arr) ? arr.filter(func).reduce((acc, val) => {
                arr.splice(arr.indexOf(val), 1);
                return acc.concat(val);
            }, []) : [];
        },
        onRedpacket(idx) {
            const self = this;
            // 点击的红包
            const selectedRedpacket = self.redpackets[idx];
            // 随机生成一个红包
            const simpleRedpacket = self.preRedpackets[Math.floor(Math.random() * self.preRedpackets.length)];
            // 从可选的红包中remove点击的红包
            // self.remove(self.redpackets, ele => ele.aria === selectedRedpacket.aria);
            self.redpackets[idx].active = true;
            // push点击的红包预选红包中
            self.preRedpackets.push(selectedRedpacket);
            // 从预选红包中remove随机生成的红包
            self.remove(self.preRedpackets, ele => ele.aria === simpleRedpacket.aria);
            // push随生成的红包到可选的红包中
            // self.redpackets.push(simpleRedpacket);
            // 用随机生成的红包替换已点击的红包
            simpleRedpacket.lastAria = selectedRedpacket.aria;
            simpleRedpacket.lastActive = selectedRedpacket.active || true;
            self.redpackets = self.redpackets.map((ele) => {
                ele.lastAria = false;
                ele.lastActive = false;
                return ele.aria === selectedRedpacket.aria ? simpleRedpacket : ele;
            });
        },
        closeDialog(name) {
            const self = this;
            self.dialogs[name].open = false;
        },
        startGrab() {
            const self = this;
            self.unStart = false;
            self.unStartMsg = false;
            setTimeout(() => {
                self.closeDialog('grab');
                self.dialogs.countdown.open = true;
                self.startCountdown();
            }, 600);
        },
        startCountdown() {
            let timer = null;
            const self = this;

            timer = setInterval(() => {
                self.countdowns.begin -= 1;
                if (self.countdowns.begin === 0) {
                    clearInterval(timer);
                    self.closeDialog('countdown');
                    self.playCountdown();
                }
            }, 1000);
        },
        playCountdown() {
            let timer = null;
            const self = this;

            timer = setInterval(() => {
                self.countdowns.play -= 1;
                if (self.countdowns.play === 0) {
                    clearInterval(timer);
                }
            }, 1000);
        },
    },
    mounted() {
        const self = this;
        self.unStart = true;
        setTimeout(() => {
            self.unStartMsg = true;
        }, 600);
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
    mounted() {
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
