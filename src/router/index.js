import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: "/admin_group",
    component: Layout,
    redirect: '/admin_group/list',
    meta: { title: "管理员组", icon: "el-icon-s-check" },
    children: [{
      path: "add",
      name: "AdminGroupAdd",
      component: () => import("@/views/admin-group/add"),
      meta: { title: "创建管理员组" }
    }, {
      path: "list",
      name: "AdminGroupList",
      component: () => import("@/views/admin-group/list"),
      meta: { title: "管理员组列表" }
    }, {
      path: "edit/:id(\\d+)",
      name: "AdminGroupEdit",
      component: () => import("@/views/admin-group/edit"),
      meta: { title: "编辑管理员组", activeMenu: '/admin_group/list' },
      hidden: true
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
