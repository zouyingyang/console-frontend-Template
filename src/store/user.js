import { request } from '@/services'
import storage from '@/utils/storage'
import HandlerData from '@/utils/handler-data'
import routes from '@/router/routes'
export default {
  state: {
    userInfo: null,
    avatar: require('@/assets/images/avatar.png'),
    menusTree: [],
    permission: null
  },

  mutations: {
    setUserInfo (store, value) {
      store.userInfo = value
    },
    setAvatar (store, value) {
      store.avatar = value
    },
    setMenusTree (store, value) {
      store.menusTree = value
    },
    setPermission (store, value) {
      store.permission = value
    }
  },

  getters: {
    userInfo (state) {
      return state.userInfo
    },
    avatar (state) {
      return state.avatar
    },
    menusTree (state) {
      return state.menusTree
    },
    permission (state) {
      return state.permission
    }
  },

  actions: {
    login ({ commit }, { autoLogin, ...params }) {
      autoLogin ? storage.init('local') : storage.init('session')
      return new Promise((resolve, reject) => {
        request('login', params).then((res) => {
          if (res.status === 200) {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    /**
     * 获取用户信息
     * @param dispatch
     * @param commit
     * @param state
     * @param params
     * @returns {Promise<any>}
     */
    getCurrentUser ({ dispatch, commit, state }, { ...params }) {
      return new Promise((resolve, reject) => {
        if (!state.userInfo) {
          let resUser = {
            'status': true,
            'code': '200',
            'message': '请求处理成功',
            'data': {
              'id': '666666',
              'userName': '张三',
              'account': 'OP.88888',
              'mobile': '18888888888',
              'marketNo': 'OPPEIN.COM',
              'marketName': '欧派家居集团'
            }
          }
          // request('currentUser', params).then((resUser) => {
          storage.init('session')
          if (resUser.code === '200' && resUser.status) {
            commit('setUserInfo', resUser.data)
            storage.setItem('userInfo', JSON.stringify(resUser.data))
            resolve(resUser.data)
          } else {
            commit('setUserInfo', null)
            storage.removeItem('userInfo')
            reject(new Error())
          }
          // })
        } else {
          resolve(state.userInfo)
        }
      })
    },
    /**
     * 退出登录
     * @param commit
     * @param params
     * @returns {Promise<any>}
     */
    setUserLogout ({ commit }, { ...params }) {
      return new Promise((resolve, reject) => {
        request('setUserLogout', params).then((res) => {
          if (res.status) {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    /**
     * @desc 获取用户菜单权限
     * @param dispatch
     * @param commit
     * @param state
     * @param params
     * @returns {Promise<any>}
     */
    setMenutree ({ dispatch, commit, state }, { ...params }) {
      return new Promise((resolve, reject) => {
        if (!state.menusTree || !state.menusTree.length) {
          let resMenu = {
            'status': true,
            'code': '200',
            'message': '请求处理成功',
            'data': [{
              'id': '1',
              'parentId': '',
              'name': '系统主框架',
              'sort': 1,
              'href': '',
              'icon': '',
              'isShow': 0,
              'permission': '',
              'children': null
            }, {
              'id': '11',
              'parentId': '1',
              'name': '首页',
              'sort': 1,
              'href': '/home',
              'target': '',
              'icon': '',
              'isShow': 1,
              'permission': '',
              'children': null
            }, {
              'id': '12',
              'parentId': '1',
              'name': '表单管理',
              'sort': 2,
              'href': '/demo/form-manage',
              'icon': '',
              'isShow': 1,
              'permission': '',
              'children': null
            }, {
              'id': '121',
              'parentId': '12',
              'name': '表单DEMO',
              'sort': 1,
              'href': '/demo/form-demo',
              'icon': '',
              'isShow': 1,
              'permission': '',
              'remarks': '',
              'children': null
            }]
          }
          // request('userMenuList', params).then((resMenu) => {
          if (resMenu.code === '200' && resMenu.status) {
            if (Array.isArray(resMenu.data) && resMenu.data.length > 0) {
              const menus = resMenu.data.length ? resMenu.data : []
              const handlerData = new HandlerData()
              const authority = handlerData.authority(menus)
              commit('setPermission', authority.join('|'))
              const menusTree = handlerData.toTree(handlerData.sortTree(menus), 'id', 'parentId')

              const myRoutes = routes
              const findRouteName = (myRoutes) => {
                for (let item of myRoutes) {
                  if (item.hasOwnProperty('meta')) {
                    const findMenuName = (menusTree) => {
                      for (let menu of menusTree) {
                        if (menu.href === item.meta.href) {
                          menu.route = item.path ? item.path : ''
                          menu.icon = item.meta.icon ? item.meta.icon : ''
                        }
                        if (menu.hasOwnProperty('children') && menu.children) {
                          findMenuName(menu.children)
                        }
                      }
                    }
                    findMenuName(menusTree)
                  }
                  if (item.hasOwnProperty('children') && item.children) {
                    findRouteName(item.children)
                  }
                }
              }
              findRouteName(myRoutes)
              commit('setMenusTree', menusTree)
              resolve()
            } else {
              commit('setMenusTree', [])
              reject(new Error())
            }
          } else {
            commit('setPermission', null)
            commit('setMenusTree', [])
            reject(new Error())
          }
          // })
        } else {
          resolve(state.userInfo)
        }
      })
    }
  }
}
