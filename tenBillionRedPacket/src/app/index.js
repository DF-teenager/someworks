/**
 * Created by LHammer on 18/01/09.
 * build时autocopy脚本会自动拷贝dist目录下生成文件到template.tpl
 */
import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router';
import axios from '../api/index';
import wxShare from '../utils/es5/wxShare';
import '../assets/app.scss';

Vue.use(VueRouter);
Vue.prototype.$axios = axios;

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
            this.$emit('close-dialog', this.name);
        },
        globalCloseDialog(evt) {
            if (evt.target.className.indexOf('container') !== -1) {
                this.$emit('global-close-dialog');
            }
        },
    },
});
const home = Vue.extend({
    template: '#home',
    data() {
        return {
            showPage: 0,
            redpackets: [],
            redPacketTypes: Array.from({ length: 7 }).map((v, i) => i + 1), // 7种红包类型
            redPacketRotates: [25, 0, -25], // 红包旋转度数
            preRedpackets: [], // 预选红包
            currentTotal: 0,
            highestTotal: 0,
            isGet: false,
            dialogs: {
                grab: {
                    open: false,
                },
                countdown: {
                    open: false,
                },
                timeover: {
                    open: false,
                },
                gameover: {
                    open: false,
                },
                congratulations: {
                    open: false,
                },
                rules: {
                    open: false,
                },
                single: {
                    open: false,
                },
                highest: {
                    open: false,
                },
            },
            startStatus: false,
            startStatusDelay: false,
            countdowns: {
                begin: 3,
                play: 8,
            },
            chance: true,
            timerPlay: null,
            delayEmitClick: true,
        };
    },
    computed: {
        showProgress: function () {
            return this.$root.showProgress;
        },
    },
    created() {
        this.getDataToCatch();
    },
    watch: {
        showProgress(progress) {
            if (!progress) {
                this.play();
            }
        },
    },
    mounted() {
        if (this.$route.meta.playStatus) {
            this.play();
        }
    },
    methods: {
        // 初始化可选红包的值
        initRedpackets(redpacketValues) {
            this.redpackets = [
                { type: 1, aria: 1, value: null, rotate: 25, active: false },
                { type: 2, aria: 2, value: null, rotate: 25, active: false },
                { type: 3, aria: 3, value: null, rotate: 25, active: false },
                { type: 4, aria: 4, value: null, rotate: -25, active: false },
                { type: 5, aria: 5, value: null, rotate: 25, active: false },
                { type: 6, aria: 6, value: null, rotate: 0, active: false },
                { type: 7, aria: 7, value: null, rotate: 25, active: false },
            ];
            // 随机取红包面值
            const simpleValue = () => redpacketValues[Math.floor(Math.random() * redpacketValues.length)];
            return this.redpackets.map((e) => {
                e.value = simpleValue();
                return e;
            });
        },
        // 随机生成预选红包
        createPreRedpackets(redpacketValues) {
            const self = this;
            // 随机取红包类型
            const simpleType = () => self.redPacketTypes[Math.floor(Math.random() * self.redPacketTypes.length)];
            // 随机取红包旋转度数
            const simpleRotate = () => self.redPacketRotates[Math.floor(Math.random() * self.redPacketRotates.length)];
            // 随机取红包面值
            const simpleValue = () => redpacketValues[Math.floor(Math.random() * redpacketValues.length)];
            // 关联对象属性
            const zipObject = (props, values) => props.reduce((obj, prop, index) => {
                const o = (obj[prop] = values[index], obj);
                return o;
            }, {});

            return Array.from({ length: 12 }).map((v, i) => {
                return zipObject(
                    ['type', 'aria', 'value', 'rotate', 'active'],
                    [simpleType(), i + 8, simpleValue(), simpleRotate(), false],
                );
            });
        },
        getRedpacketValues() {
            const self = this;
            self.$axios.getRedpacketValues().then((res) => {
                self.redpackets = self.initRedpackets(res);
                self.preRedpackets = self.createPreRedpackets(res);
            });
        },
        setDataToCatch() {
            const self = this;
            const data = {
                total_money: self.currentTotal,
                max_money: self.highestTotal,
            };
            self.$axios.setDataToCatch(data);
        },
        getDataToCatch() {
            const self = this;
            self.$axios.getDataToCatch().then((res) => {
                self.highestTotal = +res.max_money;
                self.isGet = res.is_get;
            });
        },
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
            // 累加本轮游戏的红包面值
            self.currentTotal += selectedRedpacket.value;
            if (self.highestTotal < self.currentTotal) {
                self.highestTotal = self.currentTotal;
            }
            // push点击的红包预选红包中
            self.preRedpackets.push(selectedRedpacket);
            // 从预选红包中remove随机生成的红包
            self.remove(self.preRedpackets, ele => ele.aria === simpleRedpacket.aria);
            // push随生成的红包到可选的红包中
            // self.redpackets.push(simpleRedpacket);
            // 用随机生成的红包替换已点击的红包
            simpleRedpacket.lastValue = selectedRedpacket.value;
            simpleRedpacket.lastAria = selectedRedpacket.aria;
            simpleRedpacket.lastActive = selectedRedpacket.active || true;
            self.redpackets = self.redpackets.map((ele) => {
                ele.lastAria = false;
                ele.lastActive = false;
                return ele.aria === selectedRedpacket.aria ? simpleRedpacket : ele;
            });
        },
        showDialog(name) {
            let timer = null;
            const self = this;
            if (name === 'single' || name === 'highest') {
                clearInterval(this.timerPlay);
            }
            this.dialogs[name].open = true;
            if (name === 'timeover' || name === 'gameover') {
                timer = setTimeout(() => {
                    self.delayEmitClick = false;
                    if (timer) {
                        clearTimeout(timer);
                    }
                }, 900);
            }
        },
        closeDialog(name, playStatus) {
            this.dialogs[name].open = false;
            if (name === 'timeover' || name === 'gameover') {
                this.setDataToCatch();
                if (playStatus !== 'delayPlay') {
                    this.play();
                }
            }
            if (name === 'single' || name === 'highest') {
                this.playCountdown();
            }
            if (name === 'congratulations') {
                this.play();
            }
        },
        startGrab() {
            const self = this;
            let timer = null;
            self.startStatus = false;
            self.startStatusDelay = false;
            timer = setTimeout(() => {
                self.closeDialog('grab');
                self.showDialog('countdown');
                self.startCountdown();
                if (timer) {
                    clearTimeout(timer);
                }
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
            const self = this;
            const name = self.isGet === 1 ? 'gameover' : 'timeover';
            self.timerPlay = setInterval(() => {
                self.countdowns.play -= 1;
                if (self.countdowns.play === 0) {
                    clearInterval(self.timerPlay);
                    self.showDialog(name);
                }
            }, 1000);
        },
        resetCountdown() {
            this.countdowns = {
                begin: 3,
                play: 8,
            };
        },
        viewRecords() {
            this.$router.push({ name: 'records' });
        },
        receiveRedpacket(type) {
            const self = this;
            const data = {
                [type]: type === 'total_money' ? this.currentTotal : this.highestTotal,
            };
            self.$axios.receiveRedpacket(data).then((res) => {
                if (res) {
                    self.closeDialog('timeover', 'delayPlay');
                    self.showDialog('congratulations');
                    // 领取成功后清空数据
                    self.currentTotal = 0;
                    self.highestTotal = 0;
                }
            });
        },
        play() {
            let timer = null;
            this.getRedpacketValues();
            this.resetCountdown();
            this.showDialog('grab');
            this.currentTotal = 0;
            this.startStatus = true;
            timer = setTimeout(() => {
                this.startStatusDelay = true;
                if (timer) {
                    clearTimeout(timer);
                }
            }, 600);
        },
        playAgain(name) {
            this.closeDialog(name);
            this.play();
        },
    },
});
const records = Vue.extend({
    template: '#records',
    data() {
        return {
            records: [],
            loading: true,
        };
    },
    created() {
        this.getRecords();
    },
    methods: {
        getRecords() {
            const self = this;
            self.$axios.getCardRecords().then((res) => {
                self.records = res || [];
                self.loading = false;
            });
        },
    },
    beforeRouteLeave(to, from, next) {
        to.meta.playStatus = 1;
        next();
    },
});
new Vue({
    data() {
        return {
            count: 0,
            showProgress: true,
            progressPercent: 60,
            cacheImgs: [],
            imgs: [
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/page01-bg-amend.jpg',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/page-bg-1.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/page-bg-2.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/page-bg-3.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/page-bg-4.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/dialog-bg-1.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/dialog-bg-2.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/dialog-bg-3.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/countdown-bg-1.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/countdown-bg-2.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/loading-bg.jpg',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/records-bg.jpg',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/icons.png',
                'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/redpackets.png',
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
                    playStatus: 0,
                },
            },
            {
                name: 'records',
                path: '/records',
                component: records,
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
        const shareData = {
            title: '红bao', // 分享标题
            desc: '百亿活动', // 分享描述
            link: 'http://songhwwww.yind123.com/wx/fight_red_bonus', // 分享链接
            imgUrl: 'https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/03/tenBilRedPacket/share-icon.png', // 分享图标
        };
        this.$axios.getWxShareConfig().then((data) => {
            wxShare.setConfig(data);
            wxShare.init(shareData);
        });
    },
    watch: {
        count: function (val) {
            let timer = null;
            const self = this;
            const per = val / self.imgs.length;
            self.progressPercent = Math.floor(per * 100);
            if (per === 1) {
                timer = setTimeout(function () {
                    self.showProgress = false;
                    if (timer) {
                        clearTimeout(timer);
                    }
                }, 10);
            }
        },
    },
}).$mount('#app');

/**
 * 热模块替换，开发环境使用
 */
if (module.hot) {
    module.hot.accept();
}
