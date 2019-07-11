import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    // 获取信息全量表数据
    getInfoList ({ commit }, params) {
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
    // 获取全量信息表二级品类
    getAllLeve2list ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getAllLeve2list', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 获取送货安装单二级品类
    getInstallPlantClsleve2 ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getInstallPlantClsleve2', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 获取三级品类
    getInstallPlantClsleve3 ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getInstallPlantClsleve3', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 送货安装列表增加客户跟踪、订单内容字段 接口
    updateTrackingContent ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('updateTrackingContent', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 客户跟踪 new
    updateTracks ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('updateTracks', params).then((res) => {
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
