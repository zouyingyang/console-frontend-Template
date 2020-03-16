/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/8
 * Time: 17:08
 * 工具类函数
 */

import router from '../index'

export const get = (p, o) => p.reduce((xs, x) => ((xs && xs[x]) ? xs[x] : null), o)

export const checkRouterName = (routers) => {
  if (!Array.isArray(routers)) return null

  let isVlidatedRouteName = true
  routers.forEach((name) => {
    const vlidate = router.getMatchedComponents({ name })
    if (vlidate.length === 0) {
      isVlidatedRouteName = false
    }
  })

  return isVlidatedRouteName
}
