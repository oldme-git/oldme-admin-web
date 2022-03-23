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
    }, {
      path: 'account',
      component: () => import('@/views/account/index'),
      meta: { title: '账户' },
      hidden: true
    }]
  },

  {
    path: '/admin_group',
    component: Layout,
    redirect: '/admin_group/list',
    meta: { title: '管理员组', icon: 'el-icon-s-check' },
    children: [{
      path: 'add',
      name: 'AdminGroupAdd',
      component: () => import('@/views/admin-group/add'),
      meta: { title: '创建管理员组' }
    }, {
      path: 'list',
      name: 'AdminGroupList',
      component: () => import('@/views/admin-group/list'),
      meta: { title: '管理员组列表' }
    }, {
      path: 'edit/:id(\\d+)',
      name: 'AdminGroupEdit',
      component: () => import('@/views/admin-group/edit'),
      meta: { title: '编辑管理员组', activeMenu: '/admin_group/list' },
      hidden: true
    }]
  },

  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/list',
    meta: { title: '管理员', icon: 'el-icon-user-solid' },
    children: [{
      path: 'add',
      name: 'AdminAdd',
      component: () => import('@/views/admin/add'),
      meta: { title: '新增管理员' }
    }, {
      path: 'list',
      name: 'AdminList',
      component: () => import('@/views/admin/list'),
      meta: { title: '管理员列表' }
    }, {
      path: 'edit/:id(\\d+)',
      name: 'AdminEdit',
      component: () => import('@/views/admin/edit'),
      meta: { title: '编辑管理员', activeMenu: '/admin/list' },
      hidden: true
    }]
  },

  {
    path: '/article_category',
    component: Layout,
    redirect: '/article_category/list',
    meta: { title: '文章分组', icon: 'el-icon-folder-opened' },
    children: [{
      path: 'add',
      name: 'ArticleCategoryAdd',
      component: () => import('@/views/article-category/add'),
      meta: { title: '新增文章分组' }
    }, {
      path: 'list',
      name: 'ArticleCategoryList',
      component: () => import('@/views/article-category/list'),
      meta: { title: '文章分组列表' }
    }, {
      path: 'edit/:id(\\d+)',
      name: 'ArticleCategoryEdit',
      component: () => import('@/views/article-category/edit'),
      meta: { title: '编辑文章分组', activeMenu: '/article_category/list' },
      hidden: true
    }]
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    meta: { title: '文章', icon: 'el-icon-folder-opened' },
    children: [{
      path: 'add',
      name: 'ArticleAdd',
      component: () => import('@/views/article/add'),
      meta: { title: '新增文章' }
    }, {
      path: 'list',
      name: 'ArticleList',
      component: () => import('@/views/article/list'),
      meta: { title: '文章列表' }
    }, {
      path: 'edit/:id(\\d+)',
      name: 'ArticleEdit',
      component: () => import('@/views/article/edit'),
      meta: { title: '编辑文章', activeMenu: '/article/list' },
      hidden: true
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: "history", // require service support
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
