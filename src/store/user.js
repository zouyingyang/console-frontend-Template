import { request, asyncRequest } from '@/services'
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
    userName (state) {
      if (state.userInfo) {
        return state.userInfo.name
      }
      return ''
    },
    userInfo (state) {
      if (state.userInfo) {
        return state.userInfo
      }
      return ''
    },
    avatar (state) {
      return state.avatar || storage.getItem('avatar')
    },
    menusTree (state) {
      let menusTree = JSON.parse(storage.getItem('menusTree'))
      return state.menusTree || menusTree
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
    async getCurrentUser ({ commit }, { ...params }) {
      try {
        const resUser = await asyncRequest('currentUser', { ...params })
        if (resUser.status === 200 && resUser.data.code === '200' && resUser.data.status) {
          storage.init('session')
          storage.setItem('userInfo', JSON.stringify(resUser.data.data))
          commit('setUserInfo', resUser.data.data)
        }
      } catch (error) {
        storage.removeItem('userInfo')
        storage.removeItem('avatar')
        commit('setUserInfo', null)
        // console.error(error)
      }
    },
    async getMenuList ({ commit }, { ...params }) {
      try {
        const resMenu = await asyncRequest('userMenuList', params)
        if (resMenu.status === 200 && resMenu.data.code === '200' && resMenu.data.status) {
          if (!resMenu.data.data.length) {
            storage.init('session')
            storage.setItem('menusTree', JSON.stringify([]))
            commit('setMenusTree', [])
            return
          }
          const menus = resMenu.data.data
          let authority = menus.filter(i => {
            return i.permission
          }).map(j => {
            return j.permission
          })
          commit('setPermission', authority.join('|'))
          const handlerData = new HandlerData()
          const SortTree = function (arr) {
            return arr.sort((a, b) => {
              return a.sort - b.sort
            })
          }
          const menusTree = SortTree(handlerData.toTree(menus, 'id', 'parentId'))
          menusTree.forEach(list => {
            if (list.children && list.children.length) {
              SortTree(list.children)
            }
          })
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
          storage.init('session')
          storage.setItem('menusTree', JSON.stringify(menusTree))
          commit('setMenusTree', menusTree)
        }
      } catch (error) {
        storage.removeItem('menusTree')
        console.error(error)
      }
    },

    logout ({ commit }) {
      storage.init('session')
      storage.removeItem('userInfo')
      storage.removeItem('menusTree')
      storage.removeItem('crumbsList')
      storage.removeItem('userStoreList')
      commit('setMenusTree', [])
      commit('setUserInfo', null)
    },

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

    getCaptcha () {
      // to fetch data
    }
  }
}
