import {
  request
} from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    addStore (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('addStore', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    storeList (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('storeList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    updateStore (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('updateStore', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    deleteStore (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('deleteStore', params).then((res) => {
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
