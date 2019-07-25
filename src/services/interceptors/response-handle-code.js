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
    if (response.data && (!response.data.status || response.data.code !== '200')) {
      let msg = response.data.message || response.data.msg || response.data.exception || response.data.errMsg || '服务器响应状态异常'
      Message.error(msg)
    }
    return response
  },
  (error) => {
    let message = error.message
    if (!message) {
      Message.error('服务器响应状态异常')
    } else if (message && message.indexOf('timeout') !== -1) {
      Message.error('服务相应超时')
    }
    // 隐藏所有loading
    document.querySelectorAll('.el-loading-mask').forEach(list => {
      list.style.display = 'none'
    })
    Promise.reject(error)
  }
]
