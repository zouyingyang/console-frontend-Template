/**
 * 异步接口调用，与同步接口调用
 */

// import models from '@/models'
// import router from '@/router'
import ajax from './ajax'

/**
 * 异步请求
 * @param api
 * @param data
 * @returns {Promise<any>}
 */
export const request = (api, data) => new Promise((resolve, reject) => {
  ajax(api, data).then((result) => {
    resolve(result.data)
  }).catch((error) => {
    if (!error.response) {
      return
    }
    reject(error)
  })
})

/**
 * 同步请求
 * @param api
 * @param data
 * @returns {Promise<*>}
 */
export const asyncRequest = async (api, data) => {
  try {
    return await ajax(api, data)
  } catch (error) {
    // console.log(error)
    // return Promise.reject(error)
  }
}
