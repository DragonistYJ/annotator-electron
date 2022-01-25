import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/menu'
    }, {
        path: '/menu',
        name: 'Menu',
        component: () => import('../views/Menu')
    },{
        path: '/sequence-tag',
        name: 'SequenceTag',
        component: () => import('../views/SequenceTag')
    }
]

const router = new VueRouter({
    routes
})

export default router
