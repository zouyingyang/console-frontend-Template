/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/8
 * Time: 17:14
 * 检查路由权限
 */

import vue from 'vue'
import storage from '@/utils/storage'
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
  let target
  storage.init('session')
  let menusTree = storage.getItem('menusTree')
  if (!menusTree) {
    let intervalGet = setInterval(() => {
      menusTree = storage.getItem('menusTree')
      if (Array.isArray(JSON.parse(menusTree))) {
        clearInterval(intervalGet)
        let menuRouteArray = getRouteName(JSON.parse(menusTree), 'href')
        let routerMenuString = get(['meta', 'href'], to) || get(['meta', 'href'], from)
        let noAuth = get(['meta', 'noAuth'], to)
        if (!(menuRouteArray.indexOf(routerMenuString) > -1) && !noAuth) {
          target = { name: '403' }
        }
      }
      next(target)
    }, 100)
  } else if (!menusTree.length) {
    target = { name: '403' }
  } else {
    let menuRouteArray = getRouteName(JSON.parse(menusTree), 'href')
    let routerMenuString = get(['meta', 'href'], to) || get(['meta', 'href'], from)
    let noAuth = get(['meta', 'noAuth'], to)
    if (!(menuRouteArray.indexOf(routerMenuString) > -1) && !noAuth) {
      target = { name: '403' }
    }
  }
  next(target)
}

// if (!menusTree) {
//   target = { name: from.name }
//   next(target)
// } else {
// if (!menusTree || !menusTree.length) {
//   target = { name: '403' }
// } else {
//   const menuRouteArray = getRouteName(JSON.parse(menusTree), 'href')
//   // console.log('menuRouteArray:', menuRouteArray)
//   const routerMenuString = get(['meta', 'href'], to) || get(['meta', 'href'], from)
//   const noAuth = get(['meta', 'noAuth'], to)
//   // console.log('routerMenuString:', routerMenuString)
//   // console.log('!menuRouteArray.indexOf(routerMenuString) > -1:', !(menuRouteArray.indexOf(routerMenuString) > -1))
//   // console.log('!noAuth:', !noAuth)
//   // console.log('routerMenuString>>', routerMenuString, 'menuRouteArray>>', menuRouteArray, 'noAuth>>', noAuth)
//   if (!(menuRouteArray.indexOf(routerMenuString) > -1) && !noAuth) {
//     target = { name: '403' }
//   }
// }
// next(target)
// }
// }
