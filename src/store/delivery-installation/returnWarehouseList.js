import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    // 批量返仓
    mulReturnStock ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('mulReturnStock', params).then((res) => {
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
