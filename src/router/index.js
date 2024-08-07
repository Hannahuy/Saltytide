
import { createRouter, createWebHashHistory } from "vue-router"
const routes = [
    {
        path: '/',
        name: '磨刀门水道咸潮数字孪生',
        component: () => import('../components/Homepage.vue')
    },
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
