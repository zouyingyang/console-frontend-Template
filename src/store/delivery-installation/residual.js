import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    // 遗留单申请原因
    getReasonList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getReasonList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 提交遗留单申请
    submitleaveDeclareInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('submitleaveDeclareInfo', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 遗留单列表
    leaveDeclareList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('leaveDeclareList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 遗留单详情
    leaveDeclareDetail ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('leaveDeclareDetail', params).then((res) => {
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
