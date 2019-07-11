import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    // 新增结算系数规则
    saveRule ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('saveRule', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 批量删除规则
    batchDeleteRuleByIds ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('batchDeleteRuleByIds', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 查看系数规则详情
    getRuleById ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getRuleById', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 查看规则列表
    getRuleList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getRuleList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 根据品牌品类搜索名获取商场列表
    getMarketByBrandCategory ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getMarketByBrandCategory', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 根据规则名称查询
    searchByRuleName ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('searchByRuleName', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 编辑规则
    editRule ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('editRule', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    // 根据字典编码获取下级字典列表
    getDictionaryCacheListByCode ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getDictionaryCacheListByCode', params).then((res) => {
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
