const t = title => `${title} - 线下促销活动信息收集`

export default [
  {
    name: 'sale-data',
    path: '/sale-data',
    meta: {
      title: t('促销活动管理'),
      name: '促销活动管理',
      menu: '/',
      redirect: 'noredirect',
      href: '/sale-data',
      icon: 'icon-cuxiaoguanli'
    },
    component: () => import(/* webpackChunkName: 'sale-data' */ '@/views/sale-data/index'),
    children: [
      {
        name: 'data-manage',
        path: '/sale-data/data-manage',
        meta: {
          title: t('促销活动管理'),
          name: '促销活动管理',
          menu: '/sale-data/data-manage',
          href: '/sale-data/data-manage'
        },
        component: () => import('@/views/sale-data/ActiveManage'),
        children: [
          {
            name: 'single-verify',
            path: '/sale-data/single-verify',
            meta: {
              title: t('详情'),
              name: '详情',
              menu: '/sale-data/single-verify',
              href: '/sale-data/single-verify'
            },
            component: () => import(/* webpackChunkName: 'single-verify' */ '@/views/sale-data/verifySingle'),
            beforeEnter: (to, from, next) => {
              if (to.query.type === 'detail') {
                to.meta.name = '详情'
              }
              if (to.query.type === 'verify') {
                to.meta.name = '明细审核'
              }
              next()
            }
          },
          {
            name: 'multiple-verify',
            path: '/sale-data/multiple-verify',
            meta: {
              title: t('详情'),
              name: '详情',
              menu: '/',
              href: '/sale-data/single-verify'
            },
            component: () => import(/* webpackChunkName: 'multiple-verify' */ '@/views/sale-data/verifyMultiple'),
            beforeEnter: (to, from, next) => {
              if (to.query.type === 'detail') {
                to.meta.name = '详情'
              }
              if (to.query.type === 'verify') {
                to.meta.name = '明细审核'
              }
              next()
            }
          }
        ]
      },
      {
        name: 'submission',
        path: '/sale-data/submission',
        meta: {
          title: t('门店提交情况列表'),
          name: '门店提交情况列表',
          menu: '/sale-data/submission',
          href: '/sale-data/submission'
        },
        component: () => import(/* webpackChunkName: 'submission' */ '@/views/sale-data/Submission')
      }
    ]
  }
]
