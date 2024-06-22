
import { createRouter, createWebHashHistory } from "vue-router"
const routes = [
    {
        path: '/',
        name: '磨刀门河道咸潮数字孪生',
        component: () => import('../components/Homepage.vue')
    },
    // {
    //     path: '/BackManage',
    //     name: '海洋探测数据管理系统',
    //     // component: () => import('@/pages/BackManage'),
    //     children: [
    //         {
    //             path: '/Projectbackendmanagement',
    //             name: '项目管理',
    //             // component: () => import('./components/BackSystem/ProjectManage/ProjectManage.vue')
    //         }
    //     ]
    // },
]
const router = createRouter({
    history: createWebHashHistory(),
    mode: "hash",
    routes: routes
})
router.beforeEach((to) => {
    document.title = to.name
})
export default router
