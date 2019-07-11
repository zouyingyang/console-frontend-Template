/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/8
 * Time: 11:36
 * 统计分析页面，也是首页。
 */

const t = title => `${title} - 营销服务平台`

export default [
  {
    name: 'analysis',
    path: '/dashboard/analysis',
    meta: {
      title: t('首页'),
      menu: '/',
      href: '/main/home',
      icon: 'icon-shouye'
    },
    alias: '/',
    component: () => import(/* webpackChunkName: 'analysis' */ '@/views/dashboard/Analysis')
  },
  {
    name: 'blank',
    path: '/dashboard/blank',
    meta: {
      title: t('首页'),
      menu: '/',
      href: '/main/blank'
    },
    alias: '/',
    component: () => import(/* webpackChunkName: 'analysis' */ '@/views/dashboard/Analysis')
  }
]
