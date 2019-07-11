<template>
  <div v-loading="loading">
    <Card class="fix-card">
      <template slot="content">
        <!-- 文章详情 -->
        <el-form label-position="top" :model="detail" :rules="rules" ref="detail" class="detail-form">
          <el-form-item label="" prop="title" class="detail-form__title">
            <el-input v-model="detail.title" placeholder="请输入文章标题"></el-input>
            <span>{{detail.title.length}}/30</span>
          </el-form-item>
          <el-form-item label="" prop="content">
            <div>
              <v-quill-editor :content="detail.content" @onEditorChange="onEditorChange"></v-quill-editor>
            </div>
          </el-form-item>
          <el-form-item label="文章封面" prop="picture">
            <upload :accept="accepType" accept-tips="请使用jpg或者png" class="fix-upload" @onUploadChange="handleCoverChange">
              <template slot="content">
                <div class="cover-img" v-if="detail.picture">
                  <img :src="ossPath + detail.picture">
                  <p>点击图片更换封面</p>
                </div>
                <i v-else class="el-icon-plus"></i>
              </template>
            </upload>
            <p>支持jpg或者png格式的图片</p>
          </el-form-item>
          <el-form-item label="摘要" prop="summary">
            <el-input v-model="detail.summary" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="isSubmit" @click="onSubmit" size="mini">
              保存
            </el-button>
            <el-popover placement="top" width="140" v-model="visibleOfqrcode" class="f-margin">
              <canvas id="qrccode-canvas"></canvas>
              <el-button slot="reference" type="danger" size="mini" @click="createQrc">预览</el-button>
            </el-popover>
          </el-form-item>
        </el-form>
        <!-- <div class="btn-wrap">
          <textarea type="textarea" v-model="bannerUrl" placeholder="输入链接"></textarea>
          <button @click="createQrc">点击生成二维码</button>
        </div> -->
      </template>
    </Card>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import CURRENT_ENV_PATH from '../../../../../services/baseUrl'
import QRCode from 'qrcode' // 二维码
import Card from '@/components/Card' // 卡片
import VQuillEditor from '@/components/QuillEditor'// 富文本
import Upload from '@/components/Upload'// 上传组件

const moduleArticle = namespace('article')

@Component({
  components: { Card, VQuillEditor, Upload }
})
export default class ArticleDetail extends Vue {
  accepType = ['image/jpeg', 'image/png']
  qrcodeUrl = ''
  visibleOfqrcode = false
  ossPath = CURRENT_ENV_PATH.ossPath
  isSubmit = false
  loading = true
  id = ''
  detail = {
    title: '',
    content: '',
    picture: '',
    summary: ''
  }
  rules = {
    title: [
      { required: true, message: '未填写标题', trigger: 'blur' },
      { min: 1, max: 30, message: '标题长度控制在 30 个字符之内', trigger: 'blur' }
    ],
    summary: [
      { min: 0, max: 30, message: '摘要长度控制在 30 个字符之内', trigger: 'blur' }
    ],
    picture: [
      { required: true, message: '未选择封面', trigger: 'change' }
    ],
    content: [
      { required: true, message: '请填写正文', trigger: 'blur' }
    ]
  }
  @moduleArticle.Action getArticleList
  @moduleArticle.Action getArticleDetail
  @moduleArticle.Action addArticleDetail
  @moduleArticle.Action updateArticleDetail

  onEditorChange (val) {
    this.detail.content = val
  }

  createQrc () {
    const canvas = document.getElementById('qrccode-canvas')
    let id = this.id || this.$route.query.articleId
    if (!id) {
      this.visibleOfqrcode = false
      this.$message.error('保存才能预览，请保存')
      return false
    } else {
      this.visibleOfqrcode = !this.visibleOfqrcode
    }
    this.qrcodeUrl = `${CURRENT_ENV_PATH.appUrl}/index/info?share=1&id=${id}`
    console.log(this.qrcodeUrl)
    QRCode.toCanvas(canvas, this.qrcodeUrl, { width: 150 }, (error) => {
      if (error) {
        console.log(error)
      } else {
        console.log('success')
      }
    })
  }
  handleCoverChange (file) {
    // this.cover = file
    this.detail.picture = file.url

    // 触发表单验证
    this.$refs.detail.validateField('picture')
  }
  onSubmit () {
    this.$refs.detail.validate((valid) => {
      if (!valid) return false
      if (!this.detail.summary) {
        const summary = this.detail.content.replace(new RegExp('<.+?>', 'g'), '').slice(0, 30)
        this.detail.summary = summary // 如果不填，默认正文的前30个字符
      }
      this.isSubmit = true
      let postData = {
        title: this.detail.title,
        shortTitle: this.detail.title,
        content: this.detail.content,
        summary: this.detail.summary,
        picture: this.detail.picture
      }
      if (this.$route.query.articleId) {
        postData.id = this.$route.query.articleId
        this.updateArticleDetail(postData).then((res) => {
          this.$message.success(`成功修改${postData.title}`)
          this.isSubmit = false
          // // reset detail
          // this.cover = ''
          // this.$refs.detail.resetFields()
        })
      } else {
        postData.visitType = 'info_local' // 接口必填字段
        postData.type = 'info_article' // 接口必填字段
        postData.isXiaoAi = true // 接口必填字段
        // postData.category_id = '938025bb009f4cf0a379f9affb9d1913' // 接口必填字段 栏目
        this.addArticleDetail(postData).then((res) => {
          // console.log(res)
          if (res.status) {
            this.id = res.data.id // 用于预览
            this.$message.success(`成功新增${postData.title}`)
            this.isSubmit = false
            this.$router.push({ name: 'article-detail', query: { articleId: res.data.id } })
          }
          // reset detail
          // this.$refs.detail.resetFields()
        })
      }
    })
  }

  created () {
    console.log(this.$route.query.articleId)
    const id = this.$route.query.articleId
    if (id) {
      this.getArticleDetail({ id: id }).then(res => {
        // console.log(res)
        this.loading = false
        if (res.status) {
          this.detail = res.data
        }
        // console.log(this.detail)
      })
    } else {
      this.loading = false
    }
  }
}
</script>

<style src="./style.scss" lang="scss"></style>
