<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :http-request="uploadFile"
      action=""
      :show-file-list="false"
      :multiple="multiple"
      :before-upload="beforeUpload">
      <!-- :on-success="uploadSuccess"
      :on-error="uploadError" -->
      <slot name="content"></slot>
    </el-upload>
  </div>
</template>
<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import OSS from 'ali-oss'
import md5 from 'md5'
// import CURRENT_ENV_PATH from '../../services/baseUrl'
import { Loading } from 'element-ui'
@Component()
export default class Upload extends Vue {
  @Prop({
    type: Array,
    default: function () {
      return ['image/jpeg', 'image/png', 'image/gif']
    }
  })
  accept // 图片接受类型

  @Prop({
    type: Number,
    default: 10
  })
  acceptSize // 图片接受大小 单位（M）

  @Prop({
    type: Boolean,
    default: false
  })
  multiple // 是否支持多选文件

  @Prop({
    type: String,
    default: '请使用jpg或png或gif格式的图片'
  })
  acceptTips // 图片接受类型提示信息

  uploadObj = {
    raw: null,
    url: ''
  } // 上传文件的实体
  authorizationInfo = { // 阿里云授权信息
    region: '',
    bucket: '',
    accessKeyId: '',
    accessKeySecret: ''
  }

  // @Watch('uploadObj')
  // onChildChanged (val, oldVal) {
  //   console.log(val, oldVal)
  //   this.$emit('onUploadChange', val)
  // }

  // 上传图片
  uploadFile (upload) {
    const _this = this
    _this.uploadObj.raw = upload
    const files = upload.file
    let secure = false
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'ver') {
      secure = true
    }
    let client = new OSS({
      region: this.authorizationInfo.region,
      bucket: this.authorizationInfo.bucket,
      secure: secure, // 是否https
      accessKeyId: this.authorizationInfo.accessKeyId,
      accessKeySecret: this.authorizationInfo.accessKeySecret
    })
    let isType = true
    let alyNewName = this.creatName(files.name)
    let imgType = files.name.split('.')
    let fileType = imgType[imgType.length - 1].toLocaleUpperCase()
    if (fileType !== 'PNG' && fileType !== 'JPG') {
      isType = false
    }
    let loadingInstance = Loading.service({ fullscreen: true })
    if (isType) {
      // console.log('添加水印')
      this.createImage(files, 'OPPEIN欧派家居集团股份有限公司').then(data => {
        var myfile = new File([data], files.name, { type: data.type })
        // let alyNewName = this.creatName(files.name);
        client.multipartUpload(alyNewName, myfile, {
          progress: function (p) {
            return function (done) {
              done()
            }
          }
        }).then(function (results) {
          // 任务全部完成后触发任务完成，无论成功失败
          loadingInstance.close()
          _this.uploadObj.url = results.name
          // console.warn('hello', _this.uploadObj)
          _this.$emit('onUploadChange', _this.uploadObj)
          console.log('上传完成', results)
        }).catch(function (err) {
          if (err === 'The difference between the request time and the current time is too large.') {
            err = '请查看设置-通用-时间与日期 的时区时间是否设置正确'
          }
          console.log('上传失败', err)
        })
      })
    } else {
      // let alyNewName = this.creatName(files.name);
      client.multipartUpload(alyNewName, files, {
        progress: function (p) {
          return function (done) {
            done()
          }
        }
      }).then(function (results) {
        //                    console.log("任务全部完成后触发任务完成，无论成功失败");
        // 任务全部完成后触发任务完成，无论成功失败
        // this.quillUpdateImg = false
        loadingInstance.close()
        _this.uploadObj.url = results.name
        _this.uploadObj.requestUrls = results.res.requestUrls
        // console.log(_this.uploadObj)
        _this.$emit('onUploadChange', _this.uploadObj)
        console.log('上传完成', results)
      }).catch(function (err) {
        if (err === 'The difference between the request time and the current time is too large.') {
          err = '请查看设置-通用-时间与日期 的时区时间是否设置正确'
        }
        console.log('失败', err)
      })
    }
  }

  // 上传图片前
  beforeUpload (res, file) {
    // console.log('res', res, 'this.accept', this.accept, res.size / 1024 / 1024)
    // 显示loading动画
    // this.quillUpdateImg = true
    if (!this.accept.includes(res.type) && !this.accept.includes(res.name.split('.')[res.name.split('.').length - 1])) {
      this.$message.error(this.acceptTips)
      // this.quillUpdateImg = false
      return false
    }
    if (res.size / 1024 / 1024 > this.acceptSize) {
      this.$message.error(`上传文件不能超过${this.acceptSize}M`)
      return false
    }
  }
  // 获取oss临时账户
  getAuthorization () {
    //          apiGet.system.authorization({code:'all'}).then(res => {
    //              console.log("获取oss临时账户",res)
    this.loading = false
    if (res.status) {
      this.authorizationInfo.region = res.Region
      this.authorizationInfo.bucket = res.Bucket
      this.authorizationInfo.accessKeyId = res.AccessKeyId
      this.authorizationInfo.accessKeySecret = res.AccessKeySecret
    } else {
      this.$message.error('查询失败~')
    }
    //          })
  }
  // 加水印吧
  createImage (file, text) {
    let mergeData = function (newData, color, orginalData, ctx) {
      let oData = orginalData.data
      let bit, offset // offset的作用是找到alpha通道值

      switch (color) {
        case 'R':
          bit = 0
          offset = 3
          break
        case 'G':
          bit = 1
          offset = 2
          break
        case 'B':
          bit = 2
          offset = 1
          break
      }

      for (var i = 0; i < oData.length; i++) {
        if (i % 4 === bit) {
          // 只处理目标通道
          if (newData[i + offset] === 0 && oData[i] % 2 === 1) {
            // 没有信息的像素，该通道最低位置0，但不要越界
            if (oData[i] === 255) {
              oData[i]--
            } else {
              oData[i]++
            }
          } else if (newData[i + offset] !== 0 && oData[i] % 2 === 0) {
            // // 有信息的像素，该通道最低位置1，可以想想上面的斑点效果是怎么实现的
            if (oData[i] === 255) {
              oData[i]--
            } else {
              oData[i]++
            }
          }
        }
      }
      ctx.putImageData(orginalData, 0, 0)
    }

    let fileArr = file

    //   let tx=text;
    let p = new Promise((resolve, reject) => {
      let reader = null
      reader = new window.FileReader()
      reader.readAsDataURL(fileArr)
      reader.onload = function (e) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let imgObj = new Image()
        let chr = text.split('')
        let temp = ''
        let row = []
        imgObj.onload = function () {
          canvas.width = imgObj.width
          canvas.height = imgObj.height
          ctx.font = '12px Microsoft Yahei'
          for (var a = 0; a < chr.length; a++) {
            if (ctx.measureText(temp).width >= canvas.width - 12) {
              row.push(temp)
              temp = ''
            }
            temp += chr[a]
          }
          row.push(temp)
          for (var b = 0; b < row.length; b++) {
            ctx.fillText(row[b], 0, (b + 1) * 20)
          }
          // console.log(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data)
          let textData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data
          ctx.drawImage(imgObj, 0, 0)
          let orginalData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
          mergeData(textData, 'R', orginalData, ctx)
          canvas.toBlob(function (blob) {
            resolve(blob)
          }, 'image/png')
        }
        imgObj.src = e.target.result
      }
    })
    return p
  }
  // 命名的方式
  creatName (origFileName) {
    // console.log('origFileName', origFileName)
    let rnd = ''
    for (let i = 0; i < 8; i++) rnd += Math.floor(Math.random() * 10) // 八位随机数
    const suffixArr = origFileName.split('.')
    const suffix = suffixArr[suffixArr.length - 1]
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()
    const millisecond = currentDate.getTime()
    const fileName = `${year}/${month}/${day}/${millisecond}-${rnd}-${md5(origFileName).substr(8, 16)}.${suffix}`
    // console.log(fileName);
    return fileName
  }

  created () {
    // 获取oss权限信息
    this.getAuthorization()
  }
}
</script>
