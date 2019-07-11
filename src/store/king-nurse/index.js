import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    // 获取组织人员架构树
    getOrgChildNodes ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getOrgChildNodes', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 根据条件获取金保姆列表
    getGoldenHousekeeperList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getGoldenHousekeeperList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 根据用户id获取用户的信息
    getUserById ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getUserById', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 新增金保姆
    saveGoldenHousekeeper ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('saveGoldenHousekeeper', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 修改金保姆人员
    updateGoldenHousekeeper ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('updateGoldenHousekeeper', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 删除金保姆人员
    deleteGoldenHousekeeper ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('deleteGoldenHousekeeper', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 获取导入模板url
    getDownloadImportTemplate ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getDownloadImportTemplate', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 根据条件导出金保姆列表
    exportGoldenHousekeeperList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('exportGoldenHousekeeperList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 导入金保姆人员
    importExcel ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('importExcel', params).then((res) => {
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
