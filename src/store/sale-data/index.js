import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    getAuditHistoryByCondition ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getAuditHistoryByCondition', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    getActivityList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getActivityList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    createActivity ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('createActivity', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    getSingleAuditDetailByCondition ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getSingleAuditDetailByCondition', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    getMultipleAuditDetailByCondition ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('getMultipleAuditDetailByCondition', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    auditSingleAuditDetail ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('auditSingleAuditDetail', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    auditMultipleAuditDetail ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('auditMultipleAuditDetail', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    editStatus ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('editStatus', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    editActivity ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('editActivity', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    exportActivity ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('exportActivity', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    findBrandCategory ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('findBrandCategory', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    findActivityName ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('findActivityName', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    findSubmitActivity ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('findSubmitActivity', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    findNoSubmitActivity ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('findNoSubmitActivity', params).then((res) => {
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
