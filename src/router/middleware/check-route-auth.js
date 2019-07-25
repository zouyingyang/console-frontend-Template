/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/8
 * Time: 17:14
 * 检查路由权限
 */

import vue from 'vue'
import store from '../../store/index'
import { get } from './utils'

/**
 * 查找菜单数组中的 route
 * @param router
 * @param target
 * @returns {Array}
 */
const getRouteName = (router, target) => {
  if (!Array.isArray(router)) {
    vue.util.warn("[router middleware: checkRouteAuth]: getRouteName's argument expected Array")
  }

  const permission = []
  const findRouteName = (routeArr) => {
    // console.log('routeArr', routeArr)
    routeArr && routeArr.length && routeArr.map((item) => {
      // console.log('item:', item)
      if (item.hasOwnProperty(target) && item[target]) {
        permission.push(item[target])
      }
      if (item.hasOwnProperty('children')) {
        findRouteName(item.children)
      }
    })
  }
  findRouteName(router)

  return permission
}

/**
 * 路由权限检查，无权限定位到 403 页面
 * @param to
 * @param from
 * @param next
 */
export default (to, from, next) => {
  const noLogin = get(['meta', 'noLogin'], to)
  if (noLogin) {
    next()
    return
  }
  let target
  let menusTree = Array.from(store.state.user.menusTree)
  if (!menusTree) {
    target = { name: from.name }
    next(target)
  } else {
    if (!menusTree.length) {
      next({ name: '403' })
    }
    const menuRouteArray = getRouteName(menusTree, 'href')
    const routerMenuString = get(['meta', 'href'], to) || get(['meta', 'href'], from)
    const noAuth = get(['meta', 'noAuth'], to)
    if (!(menuRouteArray.indexOf(routerMenuString) > -1) && !noAuth) {
      target = { name: '403' }
    }
    next(target)
  }
}
