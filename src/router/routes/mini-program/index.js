/*
 * @Author: laiyit
 * @Date: 2018-09-14 10:03:54
 * @Last Modified by: laiyiting
 * @Last Modified time: 2018-11-13 09:09:00
 */

const t = title => `${title} - 小程序管理`

export default [
  {
    name: 'mini-program',
    path: '/mini-program',
    meta: {
      title: t('小程序管理'),
      name: '小程序管理',
      menu: '/',
      redirect: 'noredirect',
      href: '/mini-program',
      icon: 'icon-xiaochengxu'
    },
    component: () => import(/* webpackChunkName: 'mini-program' */ '@/views/mini-program/MiniProgram'),
    children: [
      {
        name: 'banner',
        path: '/mini-program/banner',
        meta: {
          title: t('广告管理'),
          name: '广告管理',
          menu: '/',
          href: '/mini-program/banner'
          // icon: 'picture'
        },
        alias: '/',
        component: () => import(/* webpackChunkName: 'banner' */ '@/views/mini-program/Banner')
      },
      {
        name: 'article',
        path: '/mini-program/article',
        meta: {
          title: t('文章管理'),
          name: '文章管理',
          menu: '/',
          href: '/mini-program/article'
          // icon: 'tickets'
        },
        alias: '/',
        component: () => import(/* webpackChunkName: 'article' */ '@/views/mini-program/Article')
      },
      {
        name: 'article-detail',
        path: '/mini-program/article/detail',
        meta: {
          title: t('文章详情'),
          name: '文章详情',
          menu: '/',
          noAuth: false,
          href: '/mini-program/article/detail'
          // icon: 'tickets'
        },
        alias: '/',
        component: () => import(/* webpackChunkName: 'article' */ '@/views/mini-program/Article/page/ArticleDetail')
      },
      {
        name: 'comment-list',
        path: '/mini-program/comment-list',
        meta: {
          title: t('评价管理'),
          name: '评价管理',
          menu: '/',
          noAuth: false,
          href: '/mini-program/comment-list'
          // icon: 'tickets'
        },
        alias: '/',
        component: () => import(/* webpackChunkName: 'comment-list' */ '@/views/mini-program/CommentList')
      },
      {
        name: 'feekback',
        path: '/mini-program/feekback/:id',
        meta: {
          title: t('客户反馈'),
          name: '客户反馈',
          menu: '/',
          noAuth: false,
          href: '/mini-program/feekback'
          // icon: 'tickets'
        },
        alias: '/',
        component: () => import(/* webpackChunkName: 'feekback' */ '@/views/mini-program/Feekback')
      },
      {
        name: 'my-order',
        path: '/mini-program/my-order',
        meta: {
          title: t('服务单'),
          name: '服务单',
          menu: '/',
          noAuth: false,
          href: '/mini-program/my-order'
          // icon: 'tickets'
        },
        alias: '/',
        component: () => import(/* webpackChunkName: 'my-order' */ '@/views/mini-program/MyOrder')
      },
      {
        name: 'my-order-detail',
        path: '/mini-program/my-order/detail/:id',
        meta: {
          title: t('我的服务单'),
          name: '我的服务单',
          menu: '/',
          noAuth: false,
          href: '/mini-program/my-order/detail'
          // icon: 'tickets'
        },
        alias: '/',
        component: () => import(/* webpackChunkName: 'my-order-detail' */ '@/views/mini-program/MyOrder/page/MyOrderDetail')
      }
    ]
  }
]
