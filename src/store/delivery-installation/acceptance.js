import {
  request
} from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    // 获取验收列表
    orderList (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('getInfoList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 批量验收
    mulAcceptance (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('mulAcceptance', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 验收历史记录
    acceptanceRecord (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('acceptanceRecord', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 完成验收
    finishAcceptance (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('finishAcceptance', params).then((res) => {
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
