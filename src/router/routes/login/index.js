/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/6
 * Time: 15:21
 * 物流送货安装 route
 */
const t = title => `${title} - 营销服务平台`

export default [
  {
    name: 'login',
    path: '/login',
    meta: {
      title: t('登录页')
    },
    component: () => import(/* webpackChunkName: 'login' */ '@/layouts/Login')
  }
]
