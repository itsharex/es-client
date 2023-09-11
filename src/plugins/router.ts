import {createRouter, createWebHashHistory} from 'vue-router';
// 引入路由

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        name: "主页",
        path: '/',
        redirect: '/home'
    }, {
        name: '主页',
        path: '/home',
        component: () => import('@/page/home/index.vue')
    }, {
        name: '数据查询',
        path: '/data-browse',
        component: () => import('@/page/data-browse/index.vue')
    }, {
        name: '基础查询',
        path: '/base-search',
        component: () => import('@/page/base-search/index.vue')
    }, {
        name: '高级查询',
        path: '/senior-search',
        component: () => import('@/page/senior-search/index.vue')
    }, {
        name: '设置',
        path: '/setting',
        component: () => import('@/page/setting/index.vue'),
        redirect: '/setting/base',
        children: [{
            name: '基础设置',
            path: 'base',
            component: () => import('@/page/setting/components/base.vue')
        }, {
            name: '连接管理',
            path: 'url',
            component: () => import('@/page/setting/components/url.vue')
        }, {
            name: '更新日志',
            path: 'update',
            component: () => import('@/page/setting/components/update.vue')
        }, {
            name: '关于',
            path: 'about',
            component: () => import('@/page/setting/components/about.vue')
        }]
    }]
});

export default router;
