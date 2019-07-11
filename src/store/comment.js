import { request } from '@/services'
import storage from '@/utils/storage'

export default {
  state: {
    userStoreList: []
  },
  mutations: {
    setStoreList (store, value) {
      store.userStoreList = value
    }
  },
  getters: {
    storeListArr (state) {
      let userStoreList = JSON.parse(storage.getItem('userStoreList'))
      return state.userStoreList || userStoreList
    }
  },
  actions: {
    getShopCommentList (context, params) {
      return new Promise((resolve, reject) => {
        request('getShopCommentList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 获取用户相关库位
    getStoreList ({ commit }, { ...params }) {
      return new Promise((resolve, reject) => {
        request('storeList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
            storage.setItem('userStoreList', JSON.stringify(res.data.list))
            commit('setStoreList', res.data.list)
          } else {
            storage.removeItem('userStoreList')
            commit('setStoreList', null)
          }
        }).catch((error) => {
          reject(error)
          storage.removeItem('userStoreList')
          commit('setStoreList', null)
        })
      })
    },
    updateShopComment (context, params) {
      return new Promise((resolve, reject) => {
        request('updateShopComment', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    }
  }
}
