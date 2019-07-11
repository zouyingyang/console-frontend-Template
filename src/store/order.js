import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},
  // export const getMyCaseList = ajax().get('/cases/kn/case/getMyCasePage') // 我的案例列表
  // export const getMyOrderList = ajax().get('/cases/kn/orderCase/findMyOrder') // 我的案例列表
  // export const updateOrderCases = ajax().get('/cases/kn/orderCase/updateOrderCases') // 根据服务单ID编辑多个案例
  // export const getOrderCaseList = ajax().get('/cases/kn/orderCase/findOrderCasePageList') // 根据服务单ID获取案例
  actions: {
    getMyOrderList (context, params) {
      return new Promise((resolve, reject) => {
        request('getMyOrderList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    getOrderCaseList (context, params) {
      return new Promise((resolve, reject) => {
        request('getOrderCaseList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    getOrderCaseListDetail (context, params) {
      return new Promise((resolve, reject) => {
        request('getOrderCaseListDetail', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    getCaseList (context, params) {
      return new Promise((resolve, reject) => {
        request('getMyCaseList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    updateOrderCases (context, params) {
      return new Promise((resolve, reject) => {
        request('updateOrderCases', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    getFeekbackList (context, params) {
      return new Promise((resolve, reject) => {
        request('getFeekbackList', params).then((res) => {
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
