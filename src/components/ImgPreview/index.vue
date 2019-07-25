<template>
  <div class="main">
    <div v-for="(item, index) in imgList" :key="index" class="img-container">
      <img
        v-if="isImg(item.url)"
        :src="item.url"
        class="item-img"
      />
      <div v-else-if="!isImg(item.url)" class="item-file">
        <i class="el-icon-document"></i>
        <p>{{item.filename}}</p>
      </div>
      <div class="float">
        <div class="float-icon">
          <i class="el-icon-zoom-in zoom-in" @click.prevent="showDetail(item)"></i>
          <i class="el-icon-delete zoom-in" @click.prevent="deleteItem(item)"></i>
        </div>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal='false'
        :append-to-body='true'>
        <div class="dialog-body">
          <img width="100%" :src="dialogImageUrl" alt="">
        </div>
      </el-dialog>
    </div>
    <div class="ending">
      <slot name="ending"></slot>
    </div>
  </div>
</template>

<script>
/**
   * @param imgList {Array} 传递的属性数组
   * @param url {Object} 要展示的图片对象子项
   * <img-preview :imgList='imgArr'></img-preview>
   */

import { Vue, Component, Prop } from 'vue-property-decorator'

  @Component
class ImgPreview extends Vue {
    name = 'ImgPreview'
    @Prop({
      type: Array,
      default: function () {
        return []
      }
    })
    imgList // 图片列表
    showDetail (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }

    isImg (file) {
      const fileExt = file.slice((file.lastIndexOf('.') - 1 >>> 0) + 2)
      let extArr = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'tiff']
      extArr.forEach(list => {
        extArr.push(list.toLocaleUpperCase())
      })
      return !!(~extArr.indexOf(fileExt))
    }
    deleteItem (file) {
      console.log(file)
      let index = null
      this.imgList.forEach((item, idx) => {
        if (item.uid === file.uid) {
          index = idx
        }
      })
      this.imgList.splice(index, 1)
      this.$emit('on-remove', file, this.imgList)
    }

    dialogImageUrl = ''
    dialogVisible = false
  }

export default ImgPreview
</script>

<style src="./style.scss" lang="scss" scoped></style>
