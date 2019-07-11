/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/8
 * Time: 16:14
 * 设置用户信息，用户菜单列表到 sessiontorage 里去
 */

import { asyncRequest } from '@/services'
import storage from '@/utils/storage'
import HandlerData from '@/utils/handler-data'
import routes from '@/router/routes'

export default async (to, from, next) => {
  let target

  try {
    storage.init('session')
    if (storage.getItem('menusTree')) {
    } else {
      const res = await asyncRequest('currentUser')
      // console.log(res)
      if (res.status === 200 && res.data.code === '200' && res.data.status) {
        storage.setItem('userInfo', res.data.data)
      }
      let userInfoId = JSON.parse(storage.getItem('userInfo'))
      const resMenu = await asyncRequest('userMenuList', { 'userId': userInfoId['globalId'], 'platformType': 'MTDS2' })
      // console.log(resMenu)
      if (resMenu.status === 200 && resMenu.data.code === '200' && res.data.status) {
        const menus = resMenu.data.data
        const handlerData = new HandlerData()
        const menusTree = handlerData.toTree(menus, 'id', 'parentId')
        menusTree.sort((a, b) => {
          return a.sort - b.sort
        })
        // console.log('menusTree', JSON.parse(JSON.stringify(menusTree)))
        const myRoutes = routes
        const findRouteName = (myRoutes) => {
          for (let item of myRoutes) {
            if (item.hasOwnProperty('meta')) {
              const findMenuName = (menusTree) => {
                for (let menu of menusTree) {
                  if (menu.href === item.meta.href) {
                    // console.log(`${menu.href} - ${item.meta.href} - ${item.meta.title} - ${item.path}`)
                    menu.route = item.path ? item.path : ''
                    menu.icon = item.meta.icon ? item.meta.icon : ''
                  }
                  if (menu.hasOwnProperty('children')) {
                    findMenuName(menu.children)
                  }
                }
              }
              findMenuName(menusTree)
            }
            if (item.hasOwnProperty('children')) {
              findRouteName(item.children)
            }
          }
        }
        findRouteName(myRoutes)
        storage.setItem('menusTree', JSON.stringify(menusTree))
        storage.setItem('menus', JSON.stringify(menus))
      }
    }
  } catch (error) {
    // console.log(error)
  }

  next(target)
}
