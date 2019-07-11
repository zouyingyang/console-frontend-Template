/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/7
 * Time: 15:19
 * 聚合理由
 */

// import login from './routes/login'
import exception from './routes/exception'
import analysis from './routes/analysis'
import deliveryInstallation from './routes/delivery-installation'
import houseType from './routes/house-type'
import knowledgeBase from './routes/knowledge-base'
import oppeinCase from './routes/oppein-case'
import showHouse from './routes/show-house'
import miniProgram from './routes/mini-program'
import saleData from './routes/sale-data'
import settlementCoefficient from './routes/settlement-coefficient'
import kingNurse from './routes/king-nurse'

const t = title => `${title} - 营销服务平台`

export default [
  // ...login,
  {
    name: 'app', // 路由 name
    path: '/',
    meta: {
      title: t('首页'),
      name: '首页',
      menu: '/',
      href: '/', // 对应接口返回数据的 href,
      icon: 'icon-home'
    },
    component: () => import('@/layouts/App'),
    children: [
      ...analysis,
      ...deliveryInstallation,
      ...saleData,
      ...houseType,
      ...knowledgeBase,
      ...oppeinCase,
      ...showHouse,
      ...miniProgram,
      // ...organizationBase,
      ...settlementCoefficient,
      ...kingNurse,
      // 例外路由必须位于底部。
      ...exception
    ]
  }
]
