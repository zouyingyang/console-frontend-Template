/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/8
 * Time: 17:19
 * 设置页面标题
 */

import { get } from './utils'

export default (to, from, next) => {
  let target
  if (get(['meta', 'title'], to)) {
    window.document.title = to.meta.title
  }

  next(target)
}
