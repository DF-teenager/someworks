<!-- 
    app端开发.tpl模板
 -->
<{extends file='wx/layout/events/main.tpl'}>

<{block name=local_css_link}> 
    
<{/block}>

<{block name=content}>
	<div id="app" class="main">
		<div class="progress-block" v-if="show_progress">
            <div class="progress-outer">
                <div class="progress-enter">
                    <div class="progress-bg" :style="{width: progress_percent + '%'}"></div>
                </div>
                <div class="tooltip ft-15" :style="{left: 'calc(' + progress_percent + '%)'}">{{progress_percent}}%</div>
            </div>
        </div>
        <router-view></router-view>
	</div>
	<template id="home">
		<div class="pages" v-if="!show_progress">
			<div class="page01" :class="doorZoomOut" v-cloak v-if="page_show==1">
				<div class="snowing"></div>
				<div class="page01-inner" ref="snowing" :class="[animationPlayState ? 'running' : 'paused' ]"></div>
				<a ref="gomarket" href="javascript:void(0);" class="gomarket" :class="[animationPlayState ? 'running' : 'paused' ]" @click="gomarket">开始囤货</a>
			</div>
			<div class="page02" v-cloak v-if="page_show==2">
				<div class="page02-room">
					<div class="page02-room-title">今日可拿件数: <span>{{lotteryNum}}</span></div>
					<div class="page02-room-inner">
						<div v-for="(coupon, index) in marketCoupons" :key="coupon.id" :class="[{checked: coupon.checked}, {mid: index === 1 || index === 4 || index === 7 || index === 10}, {couplet: index >= 3 && index <= 5 || index >= 9 && index <= 11}, 'coupon' ]" @click="handleCheckedCoupon(index)">
							<span class="value"><span>{{coupon.firstBit}}</span>{{coupon.plusBit}}<span class="unit">{{coupon.unit}}</span></span>
							<span class="trapezoid">{{coupon.name}}</span>
							<transition name="checkCoupon">
								<span v-if="coupon.checked" class="mask">我要了</span>
							</transition>
						</div>
					</div>
					<a class="btn" href="javascript:void(0);" @click="takeWantCoupon">免费拿走</a>
					<router-link class="mine" :to="{name: 'records', params: {page: 2}}">查看我的年货</router-link>
				</div>
				<a href="javascript: void(0);" class="rule" @click="dialogs.rules.open = !dialogs.rules.open">规则</a>
			</div>
			<div class="page03" v-cloak v-show="page_show==3">
				<transition name="v-letter-up">
					<div v-if="page_show==3" class="page03-content">
						<span class="mine-coupon" @click="goMineCoupon"></span>
					</div>
				</transition>
				<a href="javascript: void(0);" class="rule" @click="dialogs.rules.open = !dialogs.rules.open">规则</a>
			</div>
			<v-dialog :show-dialog="dialogs.bind.open" is-bind-btn @bind-dialog="goBind" @global-close-dialog="closeDialog('bind')">
				<div class="result" slot="result">
					<p>对不起～<br>您只有完成服务号绑定<br>才能领取您的年货，快去绑定吧～</p>
				</div>
			</v-dialog>
			<v-dialog :show-dialog="dialogs.reTake.open" is-btn @close-dialog="closeDialog('reTake')">
				<div class="result" slot="result">
					<p>您可选的年货数量已用完<br>如果想要重新选择<br>直接点击不满意的年货即可～</p>
				</div>
			</v-dialog>
			<v-dialog :show-dialog="dialogs.taked.open" is-btn name="taked" @close-dialog="closeDialog('taked')">
				<div class="result" slot="result">
					<p>您挑选的{{couponNum}}件年货<br>已经发送到您的平台账户</p>
				</div>
			</v-dialog>
			<v-dialog :show-dialog="dialogs.unTake.open" is-btn @close-dialog="closeDialog('unTake')">
				<div class="result" slot="result">
					<p>请先挑选年货哦~</p>
				</div>
			</v-dialog>
			<!-- <v-dialog :show-dialog="dialogs.noTake.open" is-btn @close-dialog="closeDialog('noTake')">
				<div class="result" slot="result">
					<p>您今天可选的年货数量已用完了哦~</p>
				</div>
			</v-dialog> -->
			<v-dialog :show-dialog="dialogs.rules.open" @global-close-dialog="closeDialog('rules')">
				<div class="rules" slot="rules">
					<p>1.活动期间，每人每天可任选3个奖励，如果出借金额（期限≥30天的直投项目金额-活动期间用户债权转让金额）达到5万元，则每天可以任选6个奖励；</p>
					<p>2.以天为单位，可一次性领取3/6个奖励，也可选择任意时段分批次领取全部或部分奖励；</p>
					<p>3.所获现金卡/现金券奖励均为0.8%，现金卡可以按比例多次激活使用，现金券则为一次性激活使用。有效期7天；</p>
					<p>4.所有奖励内容，均用于出借项目期限≧30天直投项目，自动投标、手动投标均可计入（新手标除外）有效期7天；</p>
					<p>5.本次活动最终解释权归银豆网所有。</p>
				</div>
			</v-dialog>
		</div>
	</template>
	<template id="records">
		<div class="records" v-cloak>
			<div class="records-table">
				<div class="records-table-header">
					<span>日期</span>
					<span>年货</span>
				</div>
				<div v-if="coupons.length > 0" class="records-table-body">
					<div class="item" v-for="coupon in coupons" :key="coupon.date">
						<span>{{coupon.date}}</span>
						<span>{{coupon.j_name}}</span>
					</div>
				</div>
				<div v-else class="empty">暂无年货记录</div>
			</div>
		</div>
	</template>
	<template id="dialog">
		<transition name="v-dialog-fade">
			<div class="v-dialog" v-if="showDialog">
				<div class="v-dialog-mask" @click="globalCloseDialog"></div>
				<div class="v-dialog-content">
					<div class="v-dialog-content-top">
						<slot name="result"></slot>
						<slot name="rules"></slot>
					</div>
					<div class="v-dialog-content-btns">
						<a v-if="isBtn" href="javascript:;" @click="closeDialog" class="btn">知道了</a>
						<a v-if="isBindBtn" href="javascript:;" @click="bindDialog" class="btn">去绑定</a>
					</div>
				</div>
			</div>
		</transition>
	</template>
<{/block}>

<{block name=common_js_link}>

<{/block}>

<{block name=local_js_link}>
<script src="<{$g_resources_url}>/weixin/js/zepto-1.2.0.min.js"></script>
<script src="<{$g_resources_url}>/weixin/js/vue.min.2.js"></script>
<script src="<{$g_resources_url}>/weixin/js/vue-router-3.0.1.js"></script>
<{/block}>

<{block name=local_js_block}>
<script type="text/javascript">

var home = Vue.extend({
    template: '#home',
    data: function() {
        return {
            page_show: 0,
            animationPlayState: false,
            isDoorZoomOut: false,
            cantakeNum: 3,
            couponIds: [],
            lotteryNum: 0,
            couponNum: 0,
            isBind: false, // 绑定状态
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
})
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
new Vue({
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

</script>
<{/block}>

<{block name=local_css_block}>
<style>
/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{-webkit-box-sizing:content-box;box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:inherit;font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{-webkit-box-sizing:border-box;box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{-webkit-box-sizing:border-box;box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details,menu{display:block}summary{display:list-item}canvas{display:inline-block}[hidden],template{display:none}@-webkit-keyframes a{to{background-position:200% 0}}@keyframes a{to{background-position:200% 0}}@-webkit-keyframes b{0%{opacity:1;-webkit-transform:translateX(-50%) scaleX(1);transform:translateX(-50%) scaleX(1)}to{opacity:0;-webkit-transform:translateX(-50%) scale3d(.2,.2,.2);transform:translateX(-50%) scale3d(.2,.2,.2)}}@keyframes b{0%{opacity:1;-webkit-transform:translateX(-50%) scaleX(1);transform:translateX(-50%) scaleX(1)}to{opacity:0;-webkit-transform:translateX(-50%) scale3d(.2,.2,.2);transform:translateX(-50%) scale3d(.2,.2,.2)}}@-webkit-keyframes c{0%{opacity:1;-webkit-transform:scaleX(1);transform:scaleX(1)}80%,to{opacity:0;-webkit-transform:scale3d(3,3,3);transform:scale3d(3,3,3)}}@keyframes c{0%{opacity:1;-webkit-transform:scaleX(1);transform:scaleX(1)}80%,to{opacity:0;-webkit-transform:scale3d(3,3,3);transform:scale3d(3,3,3)}}@-webkit-keyframes d{to{background-position:-90rem 0}}@keyframes d{to{background-position:-90rem 0}}@-webkit-keyframes e{0%{opacity:0;-webkit-transform:translate(-50%,-50%) scale3d(.3,.3,.3) rotate(-15deg);transform:translate(-50%,-50%) scale3d(.3,.3,.3) rotate(-15deg)}to{opacity:1;-webkit-transform:translate(-50%,-50%) scaleX(1) rotate(-15deg);transform:translate(-50%,-50%) scaleX(1) rotate(-15deg)}}@keyframes e{0%{opacity:0;-webkit-transform:translate(-50%,-50%) scale3d(.3,.3,.3) rotate(-15deg);transform:translate(-50%,-50%) scale3d(.3,.3,.3) rotate(-15deg)}to{opacity:1;-webkit-transform:translate(-50%,-50%) scaleX(1) rotate(-15deg);transform:translate(-50%,-50%) scaleX(1) rotate(-15deg)}}@-webkit-keyframes f{0%{opacity:1;-webkit-transform:translate(-50%,-50%) scaleX(1) rotate(-15deg);transform:translate(-50%,-50%) scaleX(1) rotate(-15deg)}to{opacity:0;-webkit-transform:translate(-50%,-50%) scale3d(.3,.3,.3) rotate(-15deg);transform:translate(-50%,-50%) scale3d(.3,.3,.3) rotate(-15deg)}}@keyframes f{0%{opacity:1;-webkit-transform:translate(-50%,-50%) scaleX(1) rotate(-15deg);transform:translate(-50%,-50%) scaleX(1) rotate(-15deg)}to{opacity:0;-webkit-transform:translate(-50%,-50%) scale3d(.3,.3,.3) rotate(-15deg);transform:translate(-50%,-50%) scale3d(.3,.3,.3) rotate(-15deg)}}.checkCoupon-enter,.checkCoupon-enter-active{-webkit-animation:e .25s linear;animation:e .25s linear}.checkCoupon-leave-active,.checkCoupon-leave-to{-webkit-animation:f .25s linear;animation:f .25s linear}@-webkit-keyframes g{0%{opacity:0}to{opacity:1}}@keyframes g{0%{opacity:0}to{opacity:1}}@-webkit-keyframes h{0%{-webkit-transform:translate(-50%,-50%) scale(0);transform:translate(-50%,-50%) scale(0)}50%{-webkit-transform:translate(-50%,-50%) scale(1.1);transform:translate(-50%,-50%) scale(1.1)}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1)}}@keyframes h{0%{-webkit-transform:translate(-50%,-50%) scale(0);transform:translate(-50%,-50%) scale(0)}50%{-webkit-transform:translate(-50%,-50%) scale(1.1);transform:translate(-50%,-50%) scale(1.1)}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1)}}.v-dialog-fade-enter-active{-webkit-animation:g .4s;animation:g .4s}.v-dialog-fade-enter-active .v-dialog-content{-webkit-animation:h .4s;animation:h .4s}@-webkit-keyframes i{0%{opacity:0;-webkit-transform:translate3d(0,30%,0);transform:translate3d(0,30%,0)}to{opacity:1;-webkit-transform:none;transform:none}}@keyframes i{0%{opacity:0;-webkit-transform:translate3d(0,30%,0);transform:translate3d(0,30%,0)}to{opacity:1;-webkit-transform:none;transform:none}}.v-letter-up-enter,.v-letter-up-enter-active{-webkit-animation:i .5s;animation:i .5s}@-webkit-keyframes j{to{background-position:center 17.786667rem}}@keyframes j{to{background-position:center 17.786667rem}}._ellipsis{overflow:hidden;white-space:nowrap;-o-text-overflow:ellipsis;text-overflow:ellipsis}.page01 a.gomarket,.page02-room-inner .coupon .trapezoid,.page02-room-title,.page02-room a.btn,.page03-content .mine-coupon{position:absolute;left:50%}.page02-room-inner .coupon span.mask,.v-dialog-content{position:absolute;left:50%;top:50%}[data-dpr="1"] .ft-15{font-size:16px}[data-dpr="2"] .ft-15{font-size:32px}[data-dpr="3"] .ft-15{font-size:48px}[data-dpr="1"] .ft-16{font-size:16px}[data-dpr="2"] .ft-16{font-size:32px}[data-dpr="3"] .ft-16{font-size:48px}@font-face{font-family:lgdxkjt;src:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/fonts/lgdxkjt.eot);src:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/fonts/lgdxkjt.eot#iefix) format("embedded-opentype"),url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/fonts/lgdxkjt.woff) format("woff"),url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/fonts/lgdxkjt.ttf) format("truetype"),url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/fonts/lgdxkjt.svg#lgdxkjt) format("svg");font-style:normal;font-weight:400}@font-face{font-family:fjcjt;src:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/fonts/fjcjt.eot);src:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/fonts/fjcjt.eot#iefix) format("embedded-opentype"),url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/fonts/fjcjt.woff) format("woff"),url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/fonts/fjcjt.ttf) format("truetype"),url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/fonts/fjcjt.svg#fjcjt) format("svg");font-style:normal;font-weight:400}*{padding:0;margin:0;-webkit-box-sizing:border-box;box-sizing:border-box}.clearfix:after{display:block;clear:both;content:""}[v-cloak]{display:none}a:active,a:hover,a:visited{text-decoration:none}::-webkit-input-placeholder{line-height:1}body,html{line-height:1;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-family:Lantinghei SC,Microsoft Yahei Mono;-webkit-font-smoothing:antialiased}#app,body,html{height:100%}.progress-block{width:100%;height:100%;padding:0 1.386667rem;background:#25213c url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/snowingbig.png) repeat-y 0 0/100% auto;-webkit-background-size:cover;background-size:cover;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-animation:j 15s linear infinite;animation:j 15s linear infinite}.progress-outer{padding:.08rem;border:1px solid hsla(0,0%,100%,.8);-webkit-border-radius:.24rem;border-radius:.24rem;position:relative}.progress-outer .tooltip{width:1.866667rem;min-height:.533333rem;padding:.066667rem;text-align:center;position:absolute;top:-.786667rem;margin-left:-.96rem;left:10%;color:#532c0c;background:-webkit-linear-gradient(135deg,#864a41 48%,#681d12 0,#681d12 50%,#864a41 0,#864a41 96%,#681d12 0);background:-o-linear-gradient(135deg,#864a41 48%,#681d12 0,#681d12 50%,#864a41 0,#864a41 96%,#681d12 0);background:linear-gradient(-45deg,#864a41 48%,#681d12 0,#681d12 50%,#864a41 0,#864a41 96%,#681d12 0);-webkit-border-radius:.266667rem;border-radius:.266667rem;-webkit-background-size:.213333rem .213333rem;background-size:.213333rem .213333rem;color:#ccc}.progress-outer .tooltip:after{content:"";position:absolute;width:0;height:0;top:.52rem;left:.8rem;border:.16rem solid transparent;border-top-color:#864a41;border-bottom-width:0}.progress-enter{background:#713f0e}.progress-enter,.progress-enter .progress-bg{height:.266667rem;-webkit-border-radius:.133334rem;border-radius:.133334rem}.progress-enter .progress-bg{width:10%;background:-webkit-linear-gradient(135deg,#864a41 25%,#681d12 0,#681d12 50%,#864a41 0,#864a41 75%,#681d12 0) repeat-x;background:-o-linear-gradient(135deg,#864a41 25%,#681d12 0,#681d12 50%,#864a41 0,#864a41 75%,#681d12 0) repeat-x;background:linear-gradient(-45deg,#864a41 25%,#681d12 0,#681d12 50%,#864a41 0,#864a41 75%,#681d12 0) repeat-x;-webkit-background-size:.426667rem .426667rem;background-size:.426667rem .426667rem;-webkit-animation:a 20s linear infinite;animation:a 20s linear infinite}.pages{height:100%}.page01,.page02,.page03{height:inherit;position:relative}.page01{background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-1-1s.jpg) no-repeat top/100% auto}.page01 .snowing{width:100%;height:100%;background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/snowingbig.png) repeat-y top/100% auto;position:absolute;-webkit-animation:j 15s linear infinite;animation:j 15s linear infinite}.page01.doorZoomOut{-webkit-animation:c 2s linear 10ms forwards;animation:c 2s linear 10ms forwards}.page01-inner{height:100%;background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/girl-gomarket-sprites-min.png) no-repeat 0 0/100rem auto}.page01-inner.paused{-webkit-animation:none;animation:none}.page01-inner.running{-webkit-animation:d 2.7s steps(9) .3s forwards;animation:d 2.7s steps(9) .3s forwards}.page01 a.gomarket{display:inline-block;width:4.8rem;height:1.466667rem;line-height:1.573333rem;text-align:center;-webkit-border-radius:.733333rem;border-radius:.733333rem;font-family:lgdxkjt;font-size:.88rem;color:#fff;background-image:-webkit-gradient(linear,left top,left bottom,from(#ff5933),to(#f1380f));background-image:-webkit-linear-gradient(top,#ff5933,#f1380f);background-image:-o-linear-gradient(top,#ff5933,#f1380f);background-image:linear-gradient(180deg,#ff5933,#f1380f);bottom:1.2rem;-webkit-transform-origin:center;-ms-transform-origin:center;transform-origin:center}@supports not ((-webkit-transform-origin:center) or (transform-origin:center)){.page01 a.gomarket{margin-left:auto}}@supports ((-webkit-transform-origin:center) or (transform-origin:center)){.page01 a.gomarket{-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%)}}.page01 a.gomarket.paused{-webkit-animation:none;animation:none}.page01 a.gomarket.running{-webkit-animation:b .6s linear 10ms forwards;animation:b .6s linear 10ms forwards}.page01 a.gomarket:active{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,89,51,.85)),to(rgba(241,56,15,.85)));background-image:-webkit-linear-gradient(top,rgba(255,89,51,.85),rgba(241,56,15,.85));background-image:-o-linear-gradient(top,rgba(255,89,51,.85),rgba(241,56,15,.85));background-image:linear-gradient(180deg,rgba(255,89,51,.85),rgba(241,56,15,.85))}.page01 a.gomarket:after{display:inline-block;content:"";position:absolute;top:0;right:0;bottom:0;left:0;background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-1-2.png) no-repeat 50%/100% 100%}.page02{background:#24203b url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-1ss.jpg) no-repeat top/100% auto;position:relative}.page02-room{width:100%;min-height:15.92rem;background:#bd291d;padding-top:2.213333rem;position:absolute;left:0;bottom:0;-webkit-background-clip:content-box;background-clip:content-box}.page02-room-title{color:#f4d6ad;text-align:center;font-size:.373333rem;padding-top:.266667rem}@supports not ((-webkit-transform-origin:center) or (transform-origin:center)){.page02-room-title{margin-left:auto}}@supports ((-webkit-transform-origin:center) or (transform-origin:center)){.page02-room-title{-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%)}}.page02-room-title>span{color:#fff600;font-weight:500}.page02-room-inner{width:100%;height:13.453333rem;background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-2s.png) no-repeat top/100% auto;margin-top:-2.213333rem;padding:3.093333rem .96rem 0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.page02-room-inner .coupon{width:1.96rem;height:2.586667rem;background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-3.png) no-repeat top/100% auto;text-align:center;font-family:lgdxkjt;position:relative}.page02-room-inner .coupon:first-of-type,.page02-room-inner .coupon:nth-of-type(7){margin-left:.2rem}.page02-room-inner .coupon:nth-of-type(3),.page02-room-inner .coupon:nth-of-type(9){margin-right:.2rem}.page02-room-inner .coupon.couplet{width:2.413333rem;height:2.586667rem;background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-4.png) no-repeat center .30667rem/100% auto;padding-top:.306667rem}.page02-room-inner .coupon.couplet.checked{background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-4-mask.png) no-repeat center .30667rem/100% auto}.page02-room-inner .coupon.couplet.checked span.value{color:#b22117}.page02-room-inner .coupon.couplet span.value{color:#de0b00;line-height:1.413333rem}.page02-room-inner .coupon.checked{background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-2-3-mask.png) no-repeat top/100% auto}.page02-room-inner .coupon.checked span.value{color:#b9553a}.page02-room-inner .coupon.mid{margin:0 .266667rem}.page02-room-inner .coupon .trapezoid{display:inline-block;width:1.44rem;height:.48rem;border:.16rem solid transparent;border-top:0 solid;border-bottom:.48rem solid #ffe49c;color:#e0190a;font-size:.48rem;line-height:.53rem;white-space:nowrap;letter-spacing:-.12rem;bottom:.253333rem}@supports not ((-webkit-transform-origin:center) or (transform-origin:center)){.page02-room-inner .coupon .trapezoid{margin-left:auto}}@supports ((-webkit-transform-origin:center) or (transform-origin:center)){.page02-room-inner .coupon .trapezoid{-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%)}}.page02-room-inner .coupon .trapezoid:after{content:"";width:1.653333rem;height:.066667rem;background:#debd67;position:absolute;left:-.266667rem;bottom:-.52rem}.page02-room-inner .coupon span.value{display:inline-block;font-size:.8rem;color:#fffea7;white-space:nowrap;line-height:1.853333rem;font-family:fjcjt;letter-spacing:-.04rem;text-indent:.04rem}.page02-room-inner .coupon span.value>span{font-size:1.066667rem}.page02-room-inner .coupon span.value>span.unit{font-size:.426667rem;font-family:lgdxkjt;vertical-align:.12rem}.page02-room-inner .coupon span.mask{color:#fffea7;text-shadow:0 0 .08rem #6f1a1a,0 0 .08rem #6f1a1a,0 0 .08rem #6f1a1a,0 0 .08rem #6f1a1a,0 0 .08rem #6f1a1a,0 0 .08rem #6f1a1a,0 0 .08rem #6f1a1a,0 0 .08rem #6f1a1a;font-size:.773333rem;white-space:nowrap;letter-spacing:-.2rem;-webkit-transform-origin:center;-ms-transform-origin:center;transform-origin:center}@supports not ((-webkit-transform-origin:center) or (transform-origin:center)){.page02-room-inner .coupon span.mask{margin-left:auto;margin-top:auto}}@supports ((-webkit-transform-origin:center) or (transform-origin:center)){.page02-room-inner .coupon span.mask{-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%) rotate(-15deg);-ms-transform:translate(-50%,-50%) rotate(-15deg);transform:translate(-50%,-50%) rotate(-15deg);margin-top:-.2rem}}.page02-room a.btn{display:inline-block;width:3.8rem;height:1.16rem;background:-webkit-gradient(linear,left top,left bottom,from(#fbefcc),to(#f3b754));background:-webkit-linear-gradient(top,#fbefcc,#f3b754);background:-o-linear-gradient(top,#fbefcc,#f3b754);background:linear-gradient(180deg,#fbefcc,#f3b754);font-size:.733333rem;line-height:1.25rem;color:#7e5407;font-family:lgdxkjt;text-align:center;-webkit-border-radius:.6rem;border-radius:.6rem;margin-top:.653333rem}@supports not ((-webkit-transform-origin:center) or (transform-origin:center)){.page02-room a.btn{margin-left:auto}}@supports ((-webkit-transform-origin:center) or (transform-origin:center)){.page02-room a.btn{-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%)}}.page02-room a.btn:active{background-image:-webkit-gradient(linear,left top,left bottom,from(hsla(45,85%,89%,.85)),to(rgba(243,183,84,.85)));background-image:-webkit-linear-gradient(top,hsla(45,85%,89%,.85),rgba(243,183,84,.85));background-image:-o-linear-gradient(top,hsla(45,85%,89%,.85),rgba(243,183,84,.85));background-image:linear-gradient(180deg,hsla(45,85%,89%,.85),rgba(243,183,84,.85))}.page02-room a.mine{display:inline-block;font-size:.346667rem;color:#fff3c5;padding-bottom:.026667rem;border-bottom:1px solid #fff3c5;position:absolute;right:.426667rem;bottom:.733333rem}.page02 .rule{font-size:0;font-family:lgdxkjt;width:1.893333rem;height:1.893333rem;position:absolute;right:.16rem;bottom:13.52rem;text-indent:-9999px}.page03{background:#24203b url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-3-1s.jpg) no-repeat top/100% auto;position:relative}.page03-content{width:100%;height:15.306667rem;background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-3-3.png) no-repeat top/100% auto;position:absolute;left:0;bottom:0}.page03-content .mine-coupon{display:inline-block;width:2.96rem;height:2.96rem;-webkit-border-radius:50%;border-radius:50%}@supports not ((-webkit-transform-origin:center) or (transform-origin:center)){.page03-content .mine-coupon{margin-left:auto}}@supports ((-webkit-transform-origin:center) or (transform-origin:center)){.page03-content .mine-coupon{-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);bottom:5.893333rem}}.page03-content .mine-coupon:active{background-color:rgba(255,216,152,.15)}.page03 .rule{font-size:0;font-family:lgdxkjt;width:3.466667rem;height:2.253333rem;position:absolute;right:0;top:0;background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-3-4.png) no-repeat top/100% auto}.records{height:100%;background:#bd291d url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/page-4-1s.jpg) no-repeat top/100% auto;padding:2.306667rem .4rem .4rem}.records-table{width:100%;min-height:.386667rem;background:#fff;font-size:.32rem}.records-table-header{background:#880a00;color:#fef3dd;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.records-table-header>span{height:.813333rem;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;text-align:center;line-height:.8rem;border-bottom:1px solid #bd291d}.records-table-header>span:first-of-type{border-right:1px solid #bd291d}.records-table-body{background:#fff0dc;color:#740900}.records-table-body .item{width:100%}.records-table-body .item,.records-table-body .item>span{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.records-table-body .item>span{height:.813333rem;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;border-bottom:1px solid #bd291d}.records-table-body .item>span:first-of-type{border-right:1px solid #bd291d}.records-table .empty{background:#fff0dc;color:#740900;height:2.4rem;line-height:2.4rem;text-align:center}.v-dialog{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1}.v-dialog-mask{width:100%;height:100%;position:absolute;overflow:hidden;background-color:#25262d;opacity:.8}.v-dialog-content{width:10rem;min-height:3.626667rem;min-height:4.8rem;padding:2.28rem .64rem 0;font-family:lgdxkjt;background-image:-webkit-gradient(linear,left top,right top,color-stop(.78667rem,transparent),color-stop(.78667rem,#bd291d),color-stop(9.22667rem,#bd291d),color-stop(9.24rem,transparent));background-image:-webkit-linear-gradient(left,transparent .78667rem,#bd291d 0,#bd291d 9.22667rem,transparent 9.24rem);background-image:-o-linear-gradient(left,transparent .78667rem,#bd291d .78667rem,#bd291d 9.22667rem,transparent 9.24rem);background-image:linear-gradient(90deg,transparent .78667rem,#bd291d 0,#bd291d 9.22667rem,transparent 9.24rem);-webkit-background-clip:content-box;background-clip:content-box}@supports not ((-webkit-transform-origin:center) or (transform-origin:center)){.v-dialog-content{margin-left:auto;margin-top:auto}}@supports ((-webkit-transform-origin:center) or (transform-origin:center)){.v-dialog-content{-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}}.v-dialog-content:after{content:"";position:absolute;left:.773333rem;bottom:.333333rem;width:8.44rem;height:0;border-bottom:.053333rem solid #952a14}.v-dialog-content-top{margin-top:-2.28rem;padding-top:2.666667rem;background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/dialog-1.png) no-repeat -.64rem top/10rem auto}.v-dialog-content-top .result{width:8.386667rem;text-align:center;line-height:.706667rem;margin-left:.16rem;background:#bd291d;padding:.746667rem .16rem .64rem;font-size:.56rem;color:#fff4e1;letter-spacing:-.053333rem}.v-dialog-content-top .rules{padding:2.066667rem .64rem .906667rem;font-family:Lantinghei SC,Microsoft Yahei Mono;font-size:.293333rem;line-height:.4rem;color:#fff4e1;text-align:justify}.v-dialog-content-btns{width:100%;min-height:.386667rem;text-align:center;background:url(https://caiyunupload.b0.upaiyun.com/ydimg/theme/2018/01/new_year_market/dialog-2.png) no-repeat -.64rem bottom/10rem auto}.v-dialog-content-btns a.btn{display:inline-block;background:#ffe6c3;color:#880a00;font-size:.733333rem;padding:.226667rem .8rem;-webkit-border-radius:.6rem;border-radius:.6rem;margin-bottom:1.24rem}.v-dialog-content-btns a.btn:active{background-color:rgba(255,230,195,.85)}
</style>
<{/block}>

