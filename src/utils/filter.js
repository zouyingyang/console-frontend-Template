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
      return ''
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

// 阿拉伯数字转中文大写
export const toChinesNum = num => {
  let changeNum = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'] // changeNum[0] = "零"
  let unit = ['', '十', '百', '千', '万']
  num = parseInt(num)
  let getWan = (temp) => {
    let strArr = temp.toString().split('').reverse()
    let newNum = ''
    for (let i = 0; i < strArr.length; i++) {
      newNum = (i === 0 && strArr[i] === 0 ? '' : (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ? '' : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]))) + newNum
    }
    return newNum
  }
  let overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) noWan = '0' + noWan
  let capitalizationNum = overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
  if (num > 9 && num < 20) {
    capitalizationNum = capitalizationNum.substr(1, 2)
  }
  return capitalizationNum
}

// 状态码
export const statusFilter = status => {
  switch (status) {
    case '0' : return '已作废'
    case '1' : return '已返货'
    case '2' : return '已返库'
    case '10' : return '待收货'
    case '20' : return '部分收货'
    case '30' : return '已收货'
    case '40' : return '待出库'
    case '50' : return '部分待出库'
    case '60' : return '部分出库'
    case '70' : return '待送货'
    case '80' : return '部分送货'
    case '85' : return '安装搁置'
    case '90' : return '已送货'
    case '100' : return '部分安装'
    case '110' : return '已安装'
    case '120' : return '已验收'
  }
}

export const statusFilterPlus = status => {
  switch (status) {
    case '0' : return '已作废'
    case '1' : return '已返货'
    case '2' : return '已返库'
    case '10' : return '待收货'
    case '20' : return '部分收货'
    case '30' : return '已收货'
    default : return '已收货'
  }
}
// 性别
export const changeCN = value => {
  return value === 'MALE' ? '男' : '女'
}

// 品牌
export const brandFilter = value => {
  switch (value) {
    case 'brand_oppein' : return '欧派'
    case 'brand_oboli' : return '欧铂丽'
    // case 'brand_oboni' : return '欧铂尼'
  }
}

// 品类
export const categoryFilter = value => {
  switch (value) {
    case 'category_chugui' : return '橱柜'
    case 'category_weiyu' : return '卫浴'
    case 'category_yigui' : return '集成家居'
    case 'category_jinshumenchuang' : return '金属门窗'
    case 'category_mumen' : return '木门'
    // case 'category_yigui' : return '衣柜'
    case 'category_qiangshi' : return '软装'
    // case 'category_qiangshi' : return '墙饰'
    case 'category_bigFamily' : return '大家居'
  }
}

// 订单是否齐套
export const completeFilter = value => {
  switch (value) {
    case '0' : return '未收货'
    case '1' : return '部分齐套'
    case '2' : return '已齐套'
  }
}
// 二级品类是否齐套
export const secondaryCategoryFilter = value => {
  switch (value) {
    case '0' : return '未收货'
    case '1' : return '部分齐套'
    case '2' : return '已齐套'
  }
}

// 是否送装分离
export const deliverySeparationFilter = value => {
  switch (value) {
    case '0' : return '送装分离'
    case '1' : return '送装一体'
  }
}

// 例放状态
export const exampleReleaseFilter = value => {
  switch (value) {
    case '00' : return '正常'
    case '01' : return '例放'
    case '02' : return '补进'
  }
}
// 业务状态
export const businessStateFilter = value => {
  switch (value) {
    case '00' : return '收货'
    case '01' : return '退仓'
  }
}

// 验收结果
export const acceptanceResultFilter = value => {
  switch (value) {
    case '0' : return '不通过'
    case '1' : return '通过'
  }
}

// 服务号是否齐套
export const serviceStateFilter = value => {
  switch (value) {
    case '0' : return '否'
    case '1' : return '是'
  }
}

export const whetherFilter = value => {
  switch (value) {
    case '0' : return '否'
    case '1' : return '是'
  }
}
// 是否加入调度列表
export const scheduleListFilter = value => {
  switch (value) {
    case '0' : return '否'
    case '1' : return '是'
  }
}

export const toDate = val => {
  if (val) {
    return val.substring(0, 10)
  } else {
    return '无'
  }
}
// 是否加入调度列表
export const productTypeFilter = value => {
  switch (value) {
    case 'category_chugui_PTDD' : return '普通订单'
    case 'category_chugui_BQZL' : return '百强战略'
    case 'category_chugui_ZZZG' : return '整装专供'
    case 'category_chugui_TMMB' : return '台面毛板'
    case 'category_chugui_DDTM' : return '单独台面'
    case 'category_chugui_YXWS' : return '营销物料'
    case 'category_chugui_DDWJ' : return '单独五金'
    case 'category_chugui_ZXZG' : return '装修专供'
    case 'category_chugui_YSCP' : return '延伸产品'
    case 'category_chugui_250' : return '礼包百货类'
    case 'category_chugui_JZZG' : return '精装专供'
    case 'category_chugui_ZZCG' : return '组装式不锈钢橱柜'
    case 'category_chugui_CAD' : return 'CAD'
    case 'category_chugui_CADB' : return 'CAD百强战略'
    case 'category_chugui_JAZG' : return '家装专供'
    case 'category_chugui_TKTJ' : return '同款同价'
    case 'category_chugui_JAZLA' : return '家装战略A'
    case 'category_chugui_JAZLB' : return '家装战略B'
    case 'category_chugui_JAZLC' : return '家装战略C'
  }
}

export const promotionTypeFilter = value => {
  switch (value) {
    case 'PT' : return '普通'
    case 'ZXA' : return '直销A'
    case 'W' : return '网销'
    case 'ZX' : return '直销'
    case 'CX' : return '促销'
  }
}
export const orderTypeFilter = value => {
  switch (value) {
    case 'PTD' : return '普通单'
    case 'YPD' : return '样品单'
    case 'XYD' : return '小样单'
  }
}
/*
* 申报来源
* */
export const applySourceFilter = value => {
  switch (value) {
    case 'delivery' : return '送货'
    case 'install' : return '安装'
    case 'received' : return '收货'
    case 'accepte' : return '验收'
  }
}
/*
* 岗位类型
* */
export const postTypeFilter = value => {
  switch (value) {
    case '1' : return '送货员'
    case '2' : return '安装工'
    case '3' : return '调度员'
    case '4' : return '监理'
    case '5' : return '仓库管理员'
    case '6' : return '导购'
    case '7' : return '设计师'
  }
}
/*
* 回访类型
* */
export const returnTypeFilter = value => {
  switch (value) {
    case '10' : return '客户回访'
    case '20' : return '微信评价'
    default : return ''
  }
}
