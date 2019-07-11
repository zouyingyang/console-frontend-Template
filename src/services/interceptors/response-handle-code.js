/**
 * Created by Zyy.
 * User: zouyingyang@qq.com
 * Date: 2018/9/15
 * Time: 14:12
 * Desc: 返回码统一处理
 */
import CURRENT_ENV_PATH from '../baseUrl'
import { Message } from 'element-ui'

export default [
  (response) => {
    if (response.data.code !== undefined && response.data.code === '302') {
      window.location = response.data.data + CURRENT_ENV_PATH.baseUrl + '/mtdssales-delivery/delivery/index/mtds2'
      return
    } else if (response.data.code !== undefined && response.data.code !== '200') {
      let options = {}
      options.dangerouslyUseHTMLString = true
      options.message = response.data.message || response.data.msg || response.data.exception || response.data.errMsg
      options.message = options.message.split(';').join('<br/>')
      // console.log('options', options)
      Message.error(options)
    }
    return response
  },
  error => {
    Message({
      message: `服务器异常，请稍后再试！(${error.response.data.error})`,
      type: 'error',
      duration: 3000
    })
    Promise.reject(error)
  }
]
