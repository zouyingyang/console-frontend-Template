/**
 * Created by lijianyi.
 * User: kinyee@163.com
 * Date: 2019/1/15
 * Time: 13:49
 * 金保姆 route
 */
const t = title => `${title} - 金保姆`

export default [
  {
    name: 'king-nurse',
    path: '/king-nurse',
    meta: {
      title: t('金保姆'),
      name: '金保姆',
      // auth: true,
      redirect: 'noredirect',
      menu: '/king-nurse',
      href: '/king-nurse',
      icon: ''
    },
    component: () => import(/* webpackChunkName: 'king-nurse' */ '@/views/king-nurse/KingNurse'),
    children: [
      {
        name: 'attendant-management',
        path: '/king-nurse/attendant-management',
        meta: {
          title: t('金保姆服务人员管理'),
          name: '金保姆服务人员管理',
          menu: '/king-nurse/attendant-management',
          href: '/king-nurse/attendant-management'
        },
        alias: '/',
        component: () => import(/* webpackChunkName: 'attendant-management' */ '@/views/king-nurse/AttendantManagement')
      }
    ]
  }
]
