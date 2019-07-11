<template>
  <div>
    <!-- 图片上传组件辅助-->
    <el-upload
      class="avatar-uploader"
      :http-request="uploadImg"
      :action="serverUrl"
      name="img"
      :headers="header"
      :show-file-list="false"
      :before-upload="beforeUpload">
      <!-- :on-success="uploadSuccess"
      :on-error="uploadError" -->
    </el-upload>
    <!--富文本编辑器组件-->
    <el-row v-loading="quillUpdateImg">
      <quill-editor
        ref="myQuillEditor"
        id="quill-upload"
        :options="options"
        v-model="textContent"
        @change="onEditorChange($event)"
        @ready="onEditorReady($event)">
      </quill-editor>
    </el-row>
  </div>
</template>
<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import OSS from 'ali-oss'
import md5 from 'md5'
// import Component from 'vue-class-component'
// import { namespace } from 'vuex-class'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// import emitter from 'element-ui/lib/mixins/emitter'
import toolbarOptions from './toolbarOptions'
import CURRENT_ENV_PATH from '../../services/baseUrl'

import { quillEditor } from 'vue-quill-editor'
import { Loading } from 'element-ui'
@Component({
  components: { quillEditor }
  // mixins: [emitter]
})
export default class VQuillEditor extends Vue {
  @Prop({
    type: Object,
    default: function () {
      return {
        // 编辑器默认配置
        debug: 'info',
        placeholder: '从这里开始正文',
        readOnly: false,
        theme: 'snow',
        scrollingContainer: 'auto grow',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'image': function (val) {
                if (val) {
                  // 触发input框选择文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }
    }
  })
  options // 富文本配置项

  @Prop({
    type: Array,
    default: function () {
      return ['image/jpeg', 'image/png', 'video/mp4']
    }
  })
  accept // 文件接受类型

  @Prop({
    type: String,
    default: '只能上传jpg/png/gif的图片格式或者mp4视频格式'
  })
  acceptTips // 文件接受类型提示信息

  @Prop({
    type: String
    // default: '只能插入jpg或png或gif格式'
  })
  content // 富文本编辑内容

  // content = '<h1>5555</h1>'// 富文本内容
  quillUpdateImg = false // 图片loading状态
  serverUrl = '' // 图片服务器地址
  header = { token: sessionStorage.token } // 请求授权信息等
  authorizationInfo = { // 阿里云授权信息
    region: '',
    bucket: '',
    accessKeyId: '',
    accessKeySecret: ''
  }
  textContent = ''

  @Watch('textContent')
  onChildChanged (val, oldVal) {
    // console.log(val, oldVal)
    this.$emit('onEditorChange', val)
  }
  @Watch('content')
  onContentChanged (val, oldVal) {
    this.textContent = val
  }

  // 上传图片
  uploadImg (upload) {
    const files = upload.file
    let quill = this.$refs.myQuillEditor.quill
    // 获取光标所在位置
    let quillLength = quill.getSelection().index
    console.log(quillLength, upload)
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
      console.log('添加水印')
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
          //                    console.log("任务全部完成后触发任务完成，无论成功失败");
          // 任务全部完成后触发任务完成，无论成功失败
          loadingInstance.close()
          // 去掉http或者https
          let contentImg = CURRENT_ENV_PATH.ossPath.slice(CURRENT_ENV_PATH.ossPath.indexOf(':') + 1) + results.name
          console.log(contentImg)
          quill.insertEmbed(quillLength, 'image', contentImg) // ★这里才是重点★ 插入到content中
          // 调整光标到最后
          quill.setSelection(quillLength + 1)
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
        // 去掉http或者https
        let contentUrl = CURRENT_ENV_PATH.ossPath.slice(CURRENT_ENV_PATH.ossPath.indexOf(':') + 1) + results.name
        if (/^image/.test(files.type)) {
          console.log(contentUrl)
          quill.insertEmbed(quillLength, 'image', contentUrl) // ★这里才是重点★ 插入到content中
        } else if (/^video/.test(files.type)) {
          quill.insertEmbed(quillLength, 'video', contentUrl)
        }
        // 调整光标到最后
        quill.setSelection(quillLength + 1)
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
    console.log(res, file)
    // 显示loading动画
    // this.quillUpdateImg = true
    if (!this.accept.includes(res.type)) {
      this.$message(this.acceptTips)
      // this.quillUpdateImg = false
      return false
    }
  }
  // 上传图片成功
  uploadSuccess (res, file) {
    console.log(res, file)
    // res为图片服务器返回的数据
    // 获取富文本组件实例
    let quill = this.$refs.myQuillEditor.quill
    // 如果上传成功
    if (res.code === '200' && res.info !== null) {
      // 获取光标所在位置
      let length = quill.getSelection().index
      // 插入图片  res.info为服务器返回的图片地址
      quill.insertEmbed(length, 'image', res.info)
      // 调整光标到最后
      quill.setSelection(length + 1)
    } else {
      this.$message.error('图片插入失败')
    }
    // loading动画消失
    this.quillUpdateImg = false
  }
  // 上传图片失败
  uploadError (res, file) {
    console.log(res, file)
    // loading动画消失
    this.quillUpdateImg = false
    this.$message.error('图片插入失败')
  }
  // 富文本改变时
  onEditorChange (val) {
    console.log(val)
  }
  // 富文本就绪时
  onEditorReady (val) {
    console.log(val)
  }
  // 获取oss临时账户
  getAuthorization () {
    //          apiGet.system.authorization({code:'all'}).then(res => {
    //              console.log("获取oss临时账户",res)
    this.loading = false
    // 临时账号有问题  这里先写死
    let res = {
      'status': '200',
      'Region': 'oss-cn-shenzhen',
      // 'Bucket': 'opyx-mtds-test',
      'Bucket': process.env.NODE_ENV.includes('production') ? 'opyx-mtds-pro' : 'opyx-mtds-test',
      'AccessKeyId': 'LTAIFBiMxe7OkNEi',
      'AccessKeySecret': 'cFcQhtxx3XHdOGGXdY4Dl4crGrkQqv',
      'SecurityToken': 'CAISigJ1q6Ft5B2yfSjIqvTnHo7hlOgZ/KO+UB+EnkcgXPl7upDN1Dz2IHBIfnJsCOAbt/43lWBZ6/0TlqJ6QJRCWErYKJMot8zgC8Ew8MmT1fau5Jko1beXewHKeSOZsebWZ+LmNqS/Ht6md1HDkAJq3LL+bk/Mdle5MJqP+/EFA9MMRVv6F3kkYu1bPQx/ssQXGGLMPPK2SH7Qj3HXEVBjt3gb6wZ24r/txdaHuFiMzg+46JdM+9yvecf1NJQ1Y84hDofu5oEsKPqdihw3wgNR6aJ7gJZD/Tr6pdyHCzFTmU7Wb7CProw/cVYjPvlqSvMf/eKEkuVpqqnWi4jsjgpAJv0QTDRQyV5lK0ATchqAAYDQwQJpVxaItVdopf1CPuI3imudjGRKGi+gW9p3hZMEpXERYyAW0Y0QLRpMGXV4sFWpJK+I2AKCRZs8Kbc5WAeaPifUjMdDclEspRUEyxuKkuwccl2M5fgBCtPwwP5BwrqygCzfVUwHdShErmBC0SnhYyNBlSP3AolNehkiNIdJ',
      'Expiration': '2017-11-15T10:12:36Z'
    }
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
