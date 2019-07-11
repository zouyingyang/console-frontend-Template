/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/6
 * Time: 15:21
 * 欧派案例库 route
 */
const t = title => `${title} - 欧派案例库 - 营销服务平台`

export default [
  {
    path: '/oppein-case',
    meta: {
      title: t('欧派案例库'),
      name: '我的欧派案例库服务单',
      href: '/main/oppeinCaseBase',
      icon: 'icon-image'
    }
  },
  {
    name: 'my-case',
    path: '/oppein-case/my-case',
    meta: {
      title: t('我的案例库'),
      name: '我的案例库',
      menu: '/oppein-case/my-case',
      href: '/main/myCaseBase'
    },
    component: () => import(/* webpackChunkName: 'my-case' */ '@/views/form/AdvancedForm')
  }
]
