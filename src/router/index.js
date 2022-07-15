import VueRouter from "vue-router";
import Login from '../views/Login'
import LayOut from '../views/LayOut'
import MainDetail from '../views/MainDetail'
import AppDetail from '../components/AppDetail'
import AppUsers from '../components/AppUsers'
import AppMusices_upload from '../components/AppMusices_upload'
import AppMusices_manage from '../components/AppMusices_manage'
import AppShowingManage from '../components/AppShowingManage'
import Index from '../views/Index'
import Page404 from '../views/Page404'


const Router = new VueRouter({
    //7.配置路由信息
    routes: [
        {
            path: '/',
            redirect: '/Login'
        },

        {
            name: 'Login',
            path: '/Login',
            component: Login
        },

        {
            name: 'MainDetail',
            path: '/MainDetail',
            component: MainDetail
        },

        {
            name: 'LayOut',
            path: '/LayOut',
            component: LayOut,
            children: [
                {
                    name: 'AppDetail',
                    path: '/LayOut/AppDetail',
                    component: AppDetail
                },
                {
                    name: 'AppUsers',
                    path: '/LayOut/AppUsers',
                    component: AppUsers
                },
                {
                    name: 'AppMusices_upload',
                    path: '/LayOut/AppMusices_upload',
                    component: AppMusices_upload
                },
                {
                    name: 'AppMusices_manage',
                    path: '/LayOut/AppMusices_manage',
                    component: AppMusices_manage
                },
                {
                    name: 'AppShowingManage',
                    path: '/LayOut/AppShowingManage',
                    component: AppShowingManage
                },
            ]
        },

        {
            name: 'Index',
            path: '/Index',
            component: Index
        },
        {
            name: '404',
            path: '*',
            component: Page404
        }
    ]
})
Router.beforeEach((to, from, next) => {
    if (to.name != 'Login') {
        if (sessionStorage.getItem('loginKey')) {
            next()
        } else {
            next('/Login')
        }
    } else {
        next()
    }

})
export default Router
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}