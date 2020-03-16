/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/8
 * Time: 17:18
 * 登录保护，未登录页面强制跳转 login 页面
 */

import storage from '@/utils/storage'

const key = 'token'

export default (to, from, next) => {
  let target

  if (to.name === 'login' && storage.getItem(key)) {
    target = { name: from.name }
  }
  if (to.name !== 'login' && !storage.getItem(key)) {
    target = { name: 'login' }
  }

  next(target)
}
