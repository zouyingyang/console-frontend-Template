import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    getBannerList (context, params) {
      // return request('bannerList', payload)
      return new Promise((resolve, reject) => {
        request('bannerList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    getBannerDetail (context, payload) {
      return request('bannerDetail', payload)
    },
    addBannerDetail (context, payload) {
      return request('bannerAdd', payload)
    },
    updateBannerDetail ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('bannerUpdate', params).then((res) => {
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
