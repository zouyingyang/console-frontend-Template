/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/7
 * Time: 15:01
 * 路由主文件
 */

import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import NProgress from 'nprogress'

// import setUserInfoMenuList from './middleware/set-userinfo-menulist'
// import protectLogin from './middleware/protect-login'
import limitRouteFrom from './middleware/limit-route-from'
import checkRouteAuth from './middleware/check-route-auth'
import setWindowTitle from './middleware/set-window-title'
import middleware from './middleware/middleware'

Vue.use(Router)

const router = new Router({
  base: '/resources',
  mode: 'history',
  routes
})

// router.beforeEach(setUserInfoMenuList)
router.beforeEach(setWindowTitle)
// router.beforeEach(protectLogin)
router.beforeEach(limitRouteFrom)
router.beforeEach(checkRouteAuth)
router.beforeEach(middleware)

router.beforeResolve((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

export default router
