/**
 * Created by Zyy.
 * User: zouyingyang@qq.com
 * Date: 2019/3/13
 * Time: 11:39
 * Desc:
 */

/**
 * @desc 获取cookie
 * @param name cookie的key
 * @returns {string}
 */
export const getCookie = (name) => {
  var arr = document.cookie.split('; ')
  for (let i = 0; i < arr.length; i++) {
    const arr2 = arr[i].split('=')
    if (arr2[0] === name) {
      return arr2[1]
    }
  }
  return ''
}

/**
 * 设置cookie
 * @param name cookie的key
 * @param value cookie的value
 * @param expiredays 设置过期时间
 */
export const setCookie = (name, value, expiredays) => {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}

/**
 * @desc 删除cookie
 * @param name cooie的key
 */
export const delCookie = name => {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

/**
 * @desc 获取url参数
 * @param {String} name  想要获取的参数名字
 */
export const getQueryString = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
