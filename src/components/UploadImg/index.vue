<template>
  <div class="upload-container"
  v-loading="loading"
  element-loading-text="文件上传中..."
  >
    <div class="preview-list">
      <img-preview
      @on-remove='removeFile'
      :imgList='imgList'
      >
        <div slot="ending">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :http-request="uploadFile"
            action=""
            :accept="accept"
            :multiple="multiple"
            :show-file-list="false"
            :before-upload="beforeUploadFile"
            list-type="picture-card"
            :file-list="imgList"
            v-bind="$attrs"
            v-on="$listeners"
            >
            <!-- :on-success="uploadSuccess"
            :on-error="uploadError" -->
            <div class="slot-content">
              <slot name="content"></slot>
            </div>
          </el-upload>
        </div>
      </img-preview>
    </div>
  </div>
</template>
<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import OSS from 'ali-oss'
import md5 from 'md5'
import ImgPreview from '@/components/ImgPreview'
import CURRENT_ENV_PATH from '../../services/baseUrl'
@Component({
  components: { ImgPreview }
})
export default class Upload extends Vue {
  @Prop({
    type: String,
    default: function () {
      return '.jpg, .jpeg, .png, .gif'
    }
  })
  accept // 图片接受类型，星号(*)代表任何类型

  @Prop({
    type: Boolean,
    default: false
  })
  multiple // 是否支持多选文件

  @Prop({
    type: Function,
    default: function () {
      return true
    }
  })
  beforeUpload

  // 删除操作
  @Prop({
    type: Function,
    default: function () {
      return true
    }
  })
  onRemove

  loading = false // 加载提示
  dialogImageUrl = ''
  dialogVisible = false
  ossPath = CURRENT_ENV_PATH.ossPath

  // 清空文件
  clearFiles () {
    this.imgList = []
  }

  // 删除文件
  removeFile (file, fileList) {
    // console.log('removeFile:', file)
    this.onRemove(file, fileList)
    // this.$emit('on-remove', file, fileList)
  }
  handlePictureCardPreview (file) {
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  }
  authorizationInfo = { // 阿里云授权信息
    region: '',
    bucket: '',
    accessKeyId: '',
    accessKeySecret: ''
  }
  imgList = []
  uploadSuccess (response, file, fileList) {
    // console.log('uploadSuccess', response)
  }
  // 上传图片
  async uploadFile (upload) {
    // console.log('upload:', upload)
    const _this = this
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
    if (fileType !== 'PNG' && fileType !== 'JPG' && fileType !== 'GIF') {
      isType = false
    }
    this.loading = true
    if (isType) {
      client.multipartUpload(alyNewName, files, {
        progress: function (p) {
          return function (done) {
            done()
          }
        }
      }).then((results) => {
        // 任务全部完成后触发任务完成，无论成功失败
        this.loading = false
        const obj = {
          name: results.name,
          uid: upload.file.uid,
          file: upload,
          url: results.res.requestUrls[0].split('?')[0],
          filename: upload.file.name
        }
        this.imgList.push(obj)
        _this.$emit('onUploadChange', obj, this.imgList)
        // console.log('上传完成', results)
        // console.log('_this.imgList', this.imgList)
      }).catch(function (err) {
        if (err === 'The difference between the request time and the current time is too large.') {
          err = '请查看设置-通用-时间与日期 的时区时间是否设置正确'
        }
        // console.log('上传失败', err)
      })
    } else {
      // let alyNewName = this.creatName(files.name);
      client.multipartUpload(alyNewName, files, {
        progress: function (p) {
          return function (done) {
            done()
          }
        }
      }).then((results) => {
        // console.log('上传完成（非图片文件）', results)
        // console.log("任务全部完成后触发任务完成，无论成功失败");
        // 任务全部完成后触发任务完成，无论成功失败
        this.loading = false
        const obj = {
          name: results.name,
          uid: upload.file.uid,
          file: upload,
          url: results.res.requestUrls[0].split('?')[0],
          filename: upload.file.name
        }
        this.imgList.push(obj)
        _this.$emit('onUploadChange', obj, this.imgList)
        // console.log('_this.imgList', this.imgList)
      }).catch(function (err) {
        if (err === 'The difference between the request time and the current time is too large.') {
          err = '请查看设置-通用-时间与日期 的时区时间是否设置正确'
        }
        // console.log('失败>>>>', err)
      })
    }
  }

  // 上传图片前
  beforeUploadFile (file) {
    const returnVal = this.beforeUpload()
    // console.log(returnVal)
    if (!returnVal) {
      return false
    }
    const fileNameExt = file.name.slice((file.name.lastIndexOf('.') - 1 >>> 0) + 2)
    const accept = this.accept
    if (accept === '*') {
      return true
    }
    const acceptArr = this.accept.split(',')
    const bool = acceptArr.some((item) => {
      const str = item.replace(/\s+/g, '')
      return str === `.${fileNameExt}`
    })
    if (bool) {
      return true
    } else {
      this.$message({
        duration: 2000,
        type: 'warning',
        message: `只能接受指定格式文件`
      })
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
    const file = origFileName.slice(0, origFileName.lastIndexOf('.'))
    const fileName = `${year}/${month}/${day}/${millisecond}-${rnd}-${md5(origFileName).substr(8, 16)}/${file}.${suffix}`
    // console.log(fileName);
    return fileName
  }

  created () {
    // 获取oss权限信息
    this.getAuthorization()
  }
}
</script>
<style src="./style.scss" lang="scss" scoped></style>
