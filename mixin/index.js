import axios from 'axios'
import { Message } from 'element-ui';
//音乐服务器
const axiosInstance = axios.create({
    //本地
    // baseURL: 'http://127.0.0.1:9990',
    //服务器
    baseURL: 'http://43.138.114.35:9990',
    timeout: 10000,
});
//宝塔api
const BT_axiosInstance = axios.create({
    //宝塔
    baseURL: 'http://43.138.114.35:8888',
    timeout: 10000,
});
//网易云api
const NCM_axiosInstance = axios.create({
    baseURL: 'http://43.138.114.35:6660',
    timeout: 10000,
});
//请求拦截器
axiosInstance.interceptors.request.use((config) => {
    // Do something before request is sent
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error);
});
//响应拦截器
axiosInstance.interceptors.response.use((res) => {
    if (res.data.statusCode && res.data.statusCode < 200) {
        Message.error(res.data.message)
        //终止请求的promise链
        return new Promise(() => { })
    }
    return res;
}, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

const api = {
    get(url, data) {
        return axiosInstance.get(url)
    },
    post(url, data) {
        return axiosInstance({
            method: 'post',
            params: data,
            url
        })
    }
}
const BTapi = {
    post(url, data) {
        return BT_axiosInstance({
            method: 'post',
            params: data,
            url,
            headers: {
                "Content-Type": "application/octet-stream",
                "Access-Control-Allow-Origin": "*",
            }
        })
    }
}
const ncmapi = {
    get(url, data) {
        return NCM_axiosInstance.get(url)
    },
    post(url, data) {
        return NCM_axiosInstance({
            method: 'post',
            params: data,
            url
        })
    }
}
export default {
    api,
    BTapi,
    ncmapi
}