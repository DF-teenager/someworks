/**
 * Created by LHammer on 18/02/28.
 * api 接口
 */
import axios from './config';

export function fetch(url, params) {
    return new Promise((resolve) => {
        axios.post(url, params).then((response) => {
            if (response.code === 0) {
                resolve(response.data);
            } else {
                alert(response.message);
            }
        }).catch((error) => {
            alert(error);
        });
    });
}

export default {
    /**
     * 领取记录
     * @param {*} data null
     */
    getCardRecords(data) {
        return fetch('/webapi/get_activity_record', data);
    },
    /**
     * 红包面值
     * @param {*} data null
     */
    getRedpacketValues(data) {
        return fetch('/webapi/get_user_bonus', data);
    },
    /**
     * 领取奖励
     * @param {*} data total_money: 本次红包金额, max_money: 历史最高奖励金额
     */
    receiveRedpacket(data) {
        return fetch('/webapi/receive_user_bonus', data);
    },
    /**
     * 保存数据
     * @param {*} data total_money: 本次红包金额, max_money: 历史最高奖励金额
     */
    setDataToCatch(data) {
        return fetch('/webapi/keep_user_bonus', data);
    },
    /**
     * 获取保存数据
     * @param {*} data null
     */
    getDataToCatch(data) {
        return fetch('/webapi/get_user_cashcard', data);
    },
    /**
     * 微信分享config
     * @param {*} data null
     */
    getWxShareConfig(data) {
        return fetch('/webapi/wx_share_api', data);
    },
};
