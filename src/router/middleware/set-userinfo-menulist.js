/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/8
 * Time: 16:14
 * 设置用户信息，用户菜单列表
 */

import store from '../../store/index'
import { get } from './utils'

export default async (to, from, next) => {
  const noLogin = get(['meta', 'noLogin'], to)
  if (noLogin) {
    next()
    return
  }
  store.dispatch('user/getCurrentUser', {}).then(() => {
    store.dispatch('user/setMenutree', {}).then(() => {
      next()
    }).catch(_ => {
      next(403)
    })
  }).catch(_ => {
    next(403)
  })
}
