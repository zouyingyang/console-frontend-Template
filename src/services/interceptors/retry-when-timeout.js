/**
 * 请求超时，重新请求
 */
import axios from '../axios'

export default [
  response => response,
  (error) => {
    const config = error.config
    if (!config || !config.retry) return Promise.reject(error)

    config.__retryCount = config.__retryCount || 0

    if (config.__retryCount >= config.retry) {
      return Promise.reject(error)
    }

    config.__retryCount += 1

    const delayRetry = new Promise((resolve) => {
      setTimeout(() => resolve(), config.retryDelay || 0)
    })

    return delayRetry.then(() => axios(config))
  }
]
