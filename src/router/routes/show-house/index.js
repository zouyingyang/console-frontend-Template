/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/6
 * Time: 15:21
 * 样板库管理 route
 */
const t = title => `${title} - 样板库管理 - 营销服务平台`

export default [
  {
    name: 'show-house',
    path: '/show-house',
    meta: {
      title: t('样板库管理'),
      name: '样板库管理',
      menu: '/show-house',
      href: '/main/templateBase',
      icon: 'icon-image'
    },
    component: () => import(/* webpackChunkName: 'show-house' */ '@/views/form/AdvancedForm')
  }
]
