import axios from 'axios'
// import requestWithToken from './interceptors/requestWithToken'
import { handleRequestCancel, handleResponseCancel } from './interceptors/cancel-the-same-request'
import retryWhenTimeout from './interceptors/retry-when-timeout'
import responseHandleCode from './interceptors/response-handle-code'
// 环境地址
import CURRENT_ENV_PATH from './baseUrl'
import { getCookie, getQueryString } from '../utils/cookieExpand'
// oss token设置
const getOauth2AccessToken = () => {
  return getQueryString('Oauth2-AccessToken') ? getQueryString('Oauth2-AccessToken') : getCookie('Oauth2-AccessToken')
}
// axios.defaults.baseURL = '/'
// todo 根据环境构建命令更改，webpack 4 可以使用 model 配置各环境对应的 baseurl
axios.defaults.baseURL = CURRENT_ENV_PATH.baseUrl
axios.defaults.timeout = 20000
axios.defaults.withCredentials = true
axios.defaults.retry = 3
axios.defaults.retryDelay = 500
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest'
}
if (getOauth2AccessToken()) {
  axios.defaults.headers['Oauth2-AccessToken'] = getOauth2AccessToken()
}

// add a request interceptor
// axios.interceptors.request.use(...requestWithToken)
axios.interceptors.request.use(...handleRequestCancel)
axios.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

// add a response interceptor
axios.interceptors.response.use(...responseHandleCode)
axios.interceptors.response.use(...handleResponseCancel)
axios.interceptors.response.use(...retryWhenTimeout)
axios.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export default axios
