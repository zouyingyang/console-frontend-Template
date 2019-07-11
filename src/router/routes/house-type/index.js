/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/6
 * Time: 15:21
 * 户型库管理 route
 */
const t = title => `${title} - 户型库管理 - 营销服务平台`

export default [
  {
    path: '/house-type',
    meta: {
      title: t('户型管理'),
      name: '户型管理',
      href: '/main/houseTypeBase',
      icon: 'icon-gateway'
    }
  },
  {
    name: 'building-request',
    path: '/house-type/building-request',
    meta: {
      title: t('楼盘查询'),
      name: '楼盘查询',
      menu: '/house-type/basic-form',
      href: '/main/houseTypeBase/houseSearch'
    },
    component: () => import(/* webpackChunkName: 'building-request' */ '@/views/form/BasicForm')
  },
  {
    name: 'house-request',
    path: '/house-type/house-request',
    meta: {
      title: t('户型查询'),
      name: '户型查询',
      menu: '/house-type/house-request',
      href: '/main/houseTypeBase/houseTypeSearch'
    },
    component: () => import(/* webpackChunkName: 'building-request' */ '@/views/form/StepForm'),
    children: []
  }
]
