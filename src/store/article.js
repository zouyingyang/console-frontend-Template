import { request } from '@/services'

export default {
  state: {},

  mutations: {},

  getters: {},
  // export const articleList = ajax().get('/cases/kn/info/findInfoPage') // 文章列表
  // export const articleAddDetail = ajax().get('/cases/kn/info/add') // 新增文章
  // export const articleDelete = ajax().get('/cases/kn/info/delete') // 删除文章
  // export const articleUpdateStatus = ajax().post('/cases/kn/info/updateStatus') // 文章上下架
  // export const articleDetail = ajax().get('/cases/kn/info/find') // 文章详情
  // export const articleUpdateDetail = ajax().get('/cases/kn/info/update') // 修改文章详情
  actions: {
    getArticleList (context, params) {
      return new Promise((resolve, reject) => {
        request('articleList', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    getArticleDetail (context, params) {
      return new Promise((resolve, reject) => {
        request('articleDetail', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    addArticleDetail (context, params) {
      return new Promise((resolve, reject) => {
        request('articleAddDetail', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    updateArticleDetail ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('articleUpdateDetail', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    articleUpdateStatus ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('articleUpdateStatus', params).then((res) => {
          if (res.status && res.code === '200') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },
    deleteArticleDetail ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request('articleDelete', params).then((res) => {
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
