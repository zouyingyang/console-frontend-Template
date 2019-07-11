/**
 * Created by Zyy.
 * User: zouyingyang@qq.com
 * Date: 2018/9/15
 * Time: 14:12
 * Desc: 返回码统一处理
 */
import { Message } from 'element-ui'

export default [
  (response) => {
    if (response && ['110001', '110013', '110016'].join(',').indexOf(response.data.code) !== -1) {
      window.location = response.data.data + encodeURIComponent(location.href)
      return
    } else if (response.data.code && !(response.data.code === '200' || response.data.code === '100000')) {
      let message = response.data.message || response.data.msg || response.data.exception || response.data.errMsg || '未知异常'
      Message(message)
    }
    return response
  },
  error => {
    const response = error.response
    if (response && ['110001', '110013', '110016'].join(',').indexOf(response.data.code) !== -1) {
      window.location = response.data.data + encodeURIComponent(location.href)
    } else {
      let message = response.data.message || response.data.msg || response.data.exception || response.data.errMsg || '未知异常'
      Message({
        message: `服务器异常，请稍后再试！(${message})`,
        type: 'error',
        duration: 0,
        showClose: true
      })
    }
    Promise.reject(error)
  }
]
