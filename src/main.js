import Vue from 'vue'
import App from './App.vue'
import * as echarts from "echarts";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from '../node_modules/vue-router'
import router from './router'

Vue.use(VueRouter)
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

const vm = new Vue({
    el: '#app',
    render(h) {
        return h(App)
    },
    beforeCreate() {
        Vue.prototype.$bus = this    //安装全局事件总线，$bus 就是当前应用的vm
    },
    router,
})