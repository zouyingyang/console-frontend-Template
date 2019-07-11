<template>
  <div class="main">
    <div v-for="(item, index) in imgList" :key="index" class="img-container">
      <img
        v-if="item && isImg(item.url) === 'IMG'"
        :src="item.url"
        class="item-img"/>
      <video
        v-if="item && isImg(item.url) === 'VIDEO'"
        :src="item.url"
        class="item-video"
        controls="true">
        您的浏览器不支持视频播放
      </video>
      <div v-else-if="item && !isImg(item.url)" class="item-file">
        <i class="el-icon-document"></i>
        <p>{{item.filename}}</p>
      </div>
      <div class="float">
        <div class="float-icon">
          <i class="el-icon-zoom-in zoom-in" @click.prevent="showDetail(item, index)"></i>
          <i class="el-icon-delete zoom-in" @click.prevent="deleteItem(item)" v-if='deleteRequired'></i>
        </div>
      </div>
    </div>
    <div class="ending">
      <slot name="ending"></slot>
    </div>
    <el-dialog
      title="查看图片"
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'
      :lock-scroll="true"
      :append-to-body='true'>
      <div class="dialog-body">
        <el-carousel
          width="500px"
          height="500px"
          ref="carouselRef"
          indicator-position="none"
          :autoplay="false">
          <el-carousel-item v-for="(item,index) in imgList" :key="index+'carousel-item'">
            <img v-if="item && isImg(item.url) === 'IMG'" :src="item.url" alt="" class="image-arousel" />
            <video
              v-if="item && isImg(item.url) === 'VIDEO'"
              :src="item.url"
              class="video-arousel"
              controls="controls">
              您的浏览器不支持视频播放
            </video>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/*
  *   imgList @param {Array} 传递的属性数组
  *   url @param {Object} 要展示的图片对象子项
  *
  *   <img-preview :imgList='imgArr'></img-preview>
  *   imgArr = [{url: 'xxx'}]
  * */
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ImgPreview extends Vue {
  name = 'ImgPreview'
  @Prop({
    type: Array,
    default: function () {
      return []
    }
  })imgList // 图片列表
  @Prop({
    type: Boolean,
    default: true
  })deleteRequired
  showDetail (file, name) {
    this.dialogVisible = true
    setTimeout(() => {
      this.$refs.carouselRef.setActiveItem(name)
    })
  }

  isImg (file) {
    const fileExt = (file.slice((file.lastIndexOf('.') - 1 >>> 0) + 2)).toLocaleUpperCase()
    let imgType = ['PNG', 'JPG', 'JPEG', 'BMP', 'GIF', 'WEBP', 'SVG', 'TIFF']
    let videpType = ['MP4', 'MOV', 'AVI', 'TS', 'RMVB']
    let type = ''
    if (imgType.indexOf(fileExt) > -1) {
      type = 'IMG'
    } else if (videpType.indexOf(fileExt) > -1) {
      type = 'VIDEO'
    }
    return type
  }
  deleteItem (file) {
    // console.log(file)
    let index = null
    this.imgList.forEach((item, idx) => {
      if (item.uid === file.uid) {
        index = idx
      }
    })
    this.imgList.splice(index, 1)
    this.$emit('on-remove', file, this.imgList)
  }
  beforeUploadVideo (file) {
    const fileExt = (file.slice((file.lastIndexOf('.') - 1 >>> 0) + 2)).toUpperCase()
    const isLt10M = file.size / 1024 / 1024 < 10
    if (['MP4', 'MOV'].indexOf(fileExt) === -1) {
      this.$message.error('请上传正确的视频格式')
      return false
    }
    if (!isLt10M) {
      this.$message.error('上传视频大小不能超过10MB哦!')
      return false
    }
  }
  dialogVisible = false
}
</script>

<style src="./style.scss" lang="scss" scoped></style>
