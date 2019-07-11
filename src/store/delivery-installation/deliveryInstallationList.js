import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    // 查询送货安装单列表
    deliveryDispatch ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('deliveryDispatch', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 批量修改送货计划
    mulModifyDeliverPlanPort ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('mulModifyDeliverPlanPort', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 批量修改安装计划
    mulModifyInstallPlanPort ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('mulModifyInstallPlanPort', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 获取送货安装工列表
    deliveryInstallStaff ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('deliveryInstallStaff', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 批量完成出库
    mulStockOut ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('mulStockOut', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 批量作废
    mulCancel ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('mulCancel', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 打印送货安装单
    printInstallList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('printInstallList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
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
    driverList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('driverList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    plateNumList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('plateNumList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    getDriverAndPlatNum ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getDriverAndPlatNum', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    saveDriverAndPlateNum ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('saveDriverAndPlateNum', params).then((res) => {
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
