/**
 * Created by LHammer on 18/03/30.
 * ES5 version
 * @class wechat share
 */
import wx from 'weixin-js-sdk';

/**
 * 微信分享接口
 * @param {Object} data 页面配置信息
 * @param {Object} data 分享内容（标题、描述、图标、链接）
 */
export default {
    setConfig: function (data) {
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appid, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.noncestr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'], // 必填，需要使用的JS接口列表
        });
    },
    init: function (share) {
        wx.ready(function () {
            wx.checkJsApi({
                // 检测是否支持分享的接口
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'],
                success: function (res) {
                    console.log(res);
                    /**
                     * 发送给朋友
                     */
                    wx.onMenuShareAppMessage({
                        title: share.title, // 分享标题
                        desc: share.desc, // 分享描述
                        link: share.url, // 分享链接
                        imgUrl: share.imgUrl, // 分享图标
                        type: 'link', // 分享类型,music、video或link，不填默认为link
                        // 用户确认分享后执行的回调函数
                        success: function () {},
                        // 用户取消分享后执行的回调函数
                        cancel: function () {},
                    });
                    /**
                     * 分享到朋友圈
                     */
                    wx.onMenuShareTimeline({
                        title: share.title, // 分享标题
                        link: share.url, // 分享链接
                        imgUrl: share.imgUrl, // 分享图标
                        // 用户确认分享后执行的回调函数
                        success: function () {},
                        // 用户取消分享后执行的回调函数
                        cancel: function () {},
                    });
                    /**
                     * 分享到手机QQ
                     */
                    wx.onMenuShareQQ({
                        title: share.title, // 分享标题
                        desc: share.desc, // 分享描述
                        link: share.url, // 分享链接
                        imgUrl: share.imgUrl, // 分享图标
                        // 用户确认分享后执行的回调函数
                        success: function () {},
                        // 用户取消分享后执行的回调函数
                        cancel: function () {},
                    });
                    /**
                     * 分享到QQ空间
                     */
                    wx.onMenuShareQZone({
                        title: share.title, // 分享标题
                        desc: share.desc, // 分享描述
                        link: share.url, // 分享链接
                        imgUrl: share.imgUrl, // 分享图标
                        // 用户确认分享后执行的回调函数
                        success: function () {},
                        // 用户取消分享后执行的回调函数
                        cancel: function () {},
                    });
                },
            });
        });
    },
    error: function () {
        /**
         * config信息验证失败会执行error函数;
         * 如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
         */
        wx.error(function (res) {
            console.log(res);
        });
    },
};
