import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    // 获取回访列表数据
    getReturnVisitList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('returnVisitList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 获取回访列表数据
    saveReturnVisit ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('saveReturnVisit', params).then((res) => {
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
