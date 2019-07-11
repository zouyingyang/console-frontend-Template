import {
  request
} from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},

  actions: {
    addProduct (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('addProduct', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    deleteProduct (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('deleteProduct', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    updateProduct (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('updateProduct', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    productList (context, { ...params }) {
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
    importProductExcel (context, { ...params }) {
      return new Promise((resolve, reject) => {
        request('importProductExcel', params).then((res) => {
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
