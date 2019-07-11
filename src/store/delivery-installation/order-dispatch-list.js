import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    // 获取订单服务详情
    detailContent ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('detailContent', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 验收订单可批量也可单个验收
    mulAcceptance ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('mulAcceptance', params).then((res) => {
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
