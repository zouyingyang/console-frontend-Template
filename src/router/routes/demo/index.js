/**
 * Created by Zyy.
 * User: zouyingyang@qq.com
 * Date: 2019/2/22
 * Time: 16:30
 * Desc:
 */
const t = title => `${title} - 物流送货安装 - 营销服务平台`

export default [
  {
    name: 'form-manage',
    path: '/demo/form-manage',
    meta: {
      title: t('表单管理'),
      name: '表单管理',
      // auth: true,
      redirect: 'noredirect',
      menu: '/demo/form-manage',
      href: '/demo/form-manage',
      icon: 'icon-liebiao'
    },
    component: () => import(/* webpackChunkName: 'delivery-installation-manage' */ '@/views/demo/FormManage'),
    children: [
      {
        name: 'form-demo',
        path: '/demo/form-demo',
        meta: {
          title: t('表单DEMO'),
          name: '表单DEMO',
          // auth: true,
          menu: '/demo/form-demo',
          href: '/demo/form-demo',
          icon: 'icon-liebiao'
        },
        component: () => import(/* webpackChunkName: 'full-order-info' */ '@/views/demo/FormDemo'),
        children: []
      }
    ]
  }
]
