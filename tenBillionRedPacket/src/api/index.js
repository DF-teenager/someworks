/**
 * Created by LHammer on 18/02/28.
 * api 接口
 */
import axios from './config';

export function fetch(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export default {
    /**
     * 示例接口
     * @param {*} data username
     */
    test(data) {
        return fetch('/webapi/test', data);
    },
};
