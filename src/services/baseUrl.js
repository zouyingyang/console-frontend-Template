/**
 * Created by Zyy.
 * User: zouyingyang@qq.com
 * Date: 2018/9/14
 * Time: 09:44
 * Desc:
 * 接口请求 http 协议域名http://mtdsuat.oppein.com:1120 改成 HTTPS 协议，域名：https://apigatewayuat.oppein.com  2019/4/16
 */
let CURRENT_ENV_PATH = {}
console.info('当前环境:', process.env.NODE_ENV)
switch (process.env.NODE_ENV) {
  case 'development':
    CURRENT_ENV_PATH = {
      // baseUrl: 'http://mtdsuat.oppein.com:1120',
      baseUrl: 'https://apigatewayuat.oppein.com',
      appUrl: 'https://mtdsknuat.oppein.com',
      redirectUrl: 'http://mtds2uat.oppein.com',
      ossPath: 'https://opyx-mtds-test.oss-cn-shenzhen.aliyuncs.com/' // 阿里云上传测试环境
    }
    break
  case 'sit':
    CURRENT_ENV_PATH = {
      baseUrl: 'http://10.10.2.101:1120',
      redirectUrl: 'http://mtds2sit.oppein.com',
      ossPath: 'https://opyx-mtds-test.oss-cn-shenzhen.aliyuncs.com/' // 阿里云上传测试环境
    }
    break
  case 'uat':
    CURRENT_ENV_PATH = {
      // baseUrl: 'http://mtdsuat.oppein.com:1120',
      baseUrl: 'https://apigatewayuat.oppein.com',
      appUrl: 'https://mtdsknuat.oppein.com',
      redirectUrl: 'http://mtds2uat.oppein.com',
      ossPath: 'https://opyx-mtds-test.oss-cn-shenzhen.aliyuncs.com/' // 阿里云上传测试环境
    }
    break
  case 'ver':
    CURRENT_ENV_PATH = {
      baseUrl: 'https://apigatewayver.oppein.com',
      appUrl: 'https://mtdsknuat.oppein.com',
      redirectUrl: 'http://mtds2ver.oppein.com',
      ossPath: 'https://opyx-mtds-test.oss-cn-shenzhen.aliyuncs.com/' // 阿里云上传测试环境
    }
    break
  case 'production':
    CURRENT_ENV_PATH = {
      // baseUrl: 'https://mtds6.oppein.com:1120',
      baseUrl: 'https://apigateway.oppein.com',
      redirectUrl: 'http://mtds2.oppein.com',
      appUrl: 'https://oop.oppein.com',
      ossPath: 'https://opyx-mtds-pro.oss-cn-shenzhen.aliyuncs.com/' // 阿里云上传正式环境
    }
    break
}

export default CURRENT_ENV_PATH
