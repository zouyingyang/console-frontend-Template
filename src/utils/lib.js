
// imgURL:图片返回的path，imgName：文件名字+后缀
// 下载文件的方法
// export const SaveAsFile = (fileUrl, name) => {
//   return fetch(fileUrl).then(res => res.blob().then(blob => {
//     let a = document.createElement('a')
//     let url = window.URL.createObjectURL(blob)
//     const index = fileUrl.lastIndexOf('/')
//     const filename = name || fileUrl.slice(index + 1)
//     console.log('filename', filename)
//     a.href = url
//     a.download = filename
//     a.click()
//     window.URL.revokeObjectURL(url)
//     return true
//   }))
// }
import OSS from 'ali-oss'
import { Promise } from 'bluebird'

export const SaveAsFile = (imgURL, imgName) => {
  // console.log(process.env)
  const index = imgURL.lastIndexOf('/')
  const filename = imgName || imgURL.slice(index + 1)
  let saveAs = filename
  let client = new OSS({
    'region': 'oss-cn-shenzhen',
    'bucket': process.env.NODE_ENV.includes('pro') ? 'opyx-mtds-pro' : 'opyx-mtds-test',
    'accessKeyId': '',
    'accessKeySecret': ''
  })
  let result = client.signatureUrl(imgURL, {
    expires: 3600,
    response: {
      'content-disposition': 'attachment; filename="' + saveAs + '"'
    }
  })
  window.location = result
  return Promise.resolve(true)
}

// 去掉当前路由记录
export const CrumbsFuntion = {
  removeCurrentCrumbs () {
    let crumbsList = sessionStorage.getItem('crumbsList')
    if (crumbsList) {
      crumbsList = JSON.parse(crumbsList)
      crumbsList.splice(crumbsList.length - 1, 1)
      sessionStorage.setItem('crumbsList', JSON.stringify(crumbsList))
    }
  }
}
