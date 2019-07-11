/*
 * @Author: lijianyi
 * @Date: 2018-12-14 10:30:54
 * @Last Modified by: lijianyi
 * @Last Modified time: 2018-12-14 10:30:54
 */

const t = title => `${title} - 结算系数维护`

export default [
  {
    name: 'coefficient',
    path: '/settlement-coefficient/coefficient-maintenance',
    // redirect: '/settlement-coefficient/coefficient-maintenance',
    meta: {
      title: t('结算系数管理'),
      name: '结算系数管理',
      menu: '/settlement-coefficient/coefficient-maintenance',
      href: '/settlement-coefficient/coefficient-maintenance',
      icon: 'icon-jiesuanxishu'
    },
    component: () => import(/* webpackChunkName: 'coefficient-maintenance' */ '@/views/settlement-coefficient/CoefficientMaintenance'),
    children: [
      {
        name: 'coefficient-add',
        path: '/settlement-coefficient/coefficient-add',
        meta: {
          title: t('结算系数规则-新增'),
          name: '结算系数规则-新增',
          menu: '/settlement-coefficient/coefficient-add',
          href: '/settlement-coefficient/coefficient-add',
          hidden: true
        },
        component: () => import(/* webpackChunkName: 'coefficient-add' */ '@/views/settlement-coefficient/CoefficientAdd')
      },
      {
        name: 'coefficient-verify',
        path: '/settlement-coefficient/coefficient-verify',
        meta: {
          title: t('结算系数规则-查看'),
          name: '结算系数规则-查看',
          menu: '/settlement-coefficient/coefficient-compile',
          href: '/settlement-coefficient/coefficient-compile',
          hidden: true
        },
        component: () => import(/* webpackChunkName: 'coefficient-verify' */ '@/views/settlement-coefficient/CoefficientCompile')
      },
      {
        name: 'coefficient-compile',
        path: '/settlement-coefficient/coefficient-compile',
        meta: {
          title: t('结算系数规则-编辑'),
          name: '结算系数规则-编辑',
          menu: '/settlement-coefficient/coefficient-compile',
          href: '/settlement-coefficient/coefficient-compile',
          hidden: true
        },
        component: () => import(/* webpackChunkName: 'coefficient-compile' */ '@/views/settlement-coefficient/CoefficientCompile')
      }
    ]
  }

]
