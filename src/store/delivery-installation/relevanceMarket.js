import {
  request
} from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    listMainMarket (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('listMainMarket', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    addRelationMarket (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('addRelationMarket', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    updateMarket (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('updateMarket', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    listAllMarket (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('listAllMarket', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    delMainMarket (context, { ...params
    }) {
      return new Promise((resolve, reject) => {
        request('delMainMarket', params).then((res) => {
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
