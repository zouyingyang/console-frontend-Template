import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    // 获取收货列表
    deliveryOrderList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('deliveryOrderList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 导出收货列表
    bathDeliveryExport ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('bathDeliveryExport', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },

    // 按订单签收列表（订单详情）
    takeDeliveryByOrder ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('takeDeliveryByOrder', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 查询用户的存放库位
    getStockPositionList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getStockPositionList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 批量收货
    bathDeliveryByCar ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('bathDeliveryByCar', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },

    // 修改库位
    updateStockPosition ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('updateStockPosition', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 整车返货
    returnsByCar ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('returnsByCar', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 批量签收
    takeDeliveryByCar ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('takeDeliveryByCar', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 成品收货列表
    deliveryStandardList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('deliveryStandardList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 成品签收
    signingByStandard ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('signingByStandard', params).then((res) => {
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
