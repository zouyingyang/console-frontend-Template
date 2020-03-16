export const toThousands = num => (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
export const format = (timeStamp, fmt = 'yyyy-MM-dd') => {
  /** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
    可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  * eg:
  * (timeStamp).format("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
  * (timeStamp).format("yyyy-MM-dd E HH:mm:ss") == > 2009 - 03 - 10 二 20: 09: 04
  * (timeStamp).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
  * (timeStamp).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
  * (timeStamp).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
  */
  if (!timeStamp) {
    return ''
  }
  if (typeof timeStamp === 'string') {
    timeStamp = Number(timeStamp)
    if (isNaN(timeStamp)) {
      return '---'
    }
  }
  const time = new Date(timeStamp)
  const o = {
    'M+': time.getMonth() + 1, // 月份
    'd+': time.getDate(), // 日
    'h+': time.getHours() % 12 === 0 ? 12 : time.getHours() % 12, // 小时
    'H+': time.getHours(), // 小时
    'm+': time.getMinutes(), // 分
    's+': time.getSeconds(), // 秒
    'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
    'S': time.getMilliseconds() // 毫秒
  }
  const week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[time.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 性别
 * @param value
 * @returns {string}
 * @constructor
 */
export const GenderFilter = value => {
  return value === 'MALE' ? '男' : '女'
}

/**
 * 品牌
 * @param value
 * @returns {string}
 */
export const brandFilter = value => {
  switch (value) {
    case 'brand_oppein' : return '欧派'
    case 'brand_oboli' : return '欧铂丽'
    case 'brand_oboni' : return '欧铂尼'
  }
}

/**
 * 品类
 * @param value
 * @returns {string}
 */
export const categoryFilter = value => {
  switch (value) {
    case 'category_chugui' : return '橱柜'
    case 'category_weiyu' : return '卫浴'
    case 'category_yigui' : return '集成家居'
    case 'category_jinshumenchuang' : return '金属门窗'
    case 'category_mumen' : return '木门'
    case 'category_qiangshi' : return '软装'
  }
}
