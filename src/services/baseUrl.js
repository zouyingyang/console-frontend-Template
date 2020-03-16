/**
 * Created by Zyy.
 * User: zouyingyang@qq.com
 * Date: 2018/9/14
 * Time: 09:44
 * Desc:
 */
let CURRENT_ENV_PATH = {}
console.info('当前环境:', process.env.NODE_ENV)
switch (process.env.NODE_ENV) {
  case 'development':
    CURRENT_ENV_PATH = {
      baseUrl: 'https://aaauat.bbb.com'
    }
    break
  case 'production':
    CURRENT_ENV_PATH = {
      baseUrl: 'https://aaa.bbb.com'
    }
    break
}

export default CURRENT_ENV_PATH
