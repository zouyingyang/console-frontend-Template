/**
 * 公用组件请求api
 */

import Ajax from '../convertors/ajax-config'

const ajax = config => new Ajax(config)

export const a = ajax().post('/')
