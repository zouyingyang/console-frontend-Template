/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/7
 * Time: 15:19
 * 聚合理由
 */

import demo from './routes/demo'
import exception from './routes/exception'

const t = title => `${title} - 营销服务平台`

export default [
  // ...login,
  {
    name: 'main',
    path: '/',
    meta: {
      title: t('首页'),
      name: '首页',
      menu: '/',
      href: '/',
      icon: ''
    },
    alias: '/home',
    component: () => import('@/layouts/App'),
    children: [
      ...demo,
      // 例外路由必须位于底部。
      ...exception
    ]
  }
]
