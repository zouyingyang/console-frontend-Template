import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    // 查询标准品
    productList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('productList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 查询标准品
    salesDeliveryProductList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('salesDeliveryProductList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 待确认送货安装清单查询接口
    confirmedList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('confirmedList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 待确认送货安装清单新增接口
    conflistAdd ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('conflistAdd', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 生成安装单接口
    createPlant ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('createPlant', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 待确认送货安装清单删除
    deleteRepertoire ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('deleteRepertoire', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 待确认送货安装清单删除(dev1.1添加)
    newDeleteRepertoire ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('newDeleteRepertoire', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 已添加送货安装订单数
    countList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('countList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 已添加送货安装订单数
    getShopByOrgId ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getShopByOrgId', params).then((res) => {
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
