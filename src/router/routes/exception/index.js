/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/8
 * Time: 11:32
 * 例外 404 403 500
 */

const t = title => `${title} - 营销服务平台`

export default [
  {
    name: 'home',
    path: '/home',
    meta: {
      title: t('首页'),
      name: '首页',
      menu: '/home',
      href: '/home',
      icon: 'icon-shouye'
    },
    alias: '/',
    component: () => import(/* webpackChunkName: 'analysis' */ '@/views/main/Home')
  },
  {
    name: '403',
    path: '/403',
    meta: {
      title: t('403'),
      noLogin: true,
      menu: '/403',
      href: '/403'
    },
    component: () => import(/* webpackChunkName: '403' */ '@/views/exception/403')
  },
  {
    name: '404',
    path: '/404',
    meta: {
      title: t('404'),
      noLogin: true,
      menu: '/404',
      href: '/404'
    },
    component: () => import(/* webpackChunkName: '404' */ '@/views/exception/404')
  },
  {
    name: '500',
    path: '/500',
    meta: {
      title: t('500'),
      noLogin: true,
      menu: '/500',
      href: '/500'
    },
    component: () => import(/* webpackChunkName: '500' */ '@/views/exception/500')
  },

  {
    path: '*',
    redirect: '404'
  }
]
