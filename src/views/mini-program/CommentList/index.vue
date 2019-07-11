<template>
  <div v-loading="loading" class="loading-wrap">
    <Card>
      <template v-if="commentListData" slot="content">
        <div v-if="commentListData.dataList.length">
          <el-table
              border
              :data="commentListData.dataList"
              style="width: 100%">
              <el-table-column
                  label="发布日期"
                  width="100">
                  <template slot-scope="scope">
                      <p v-if="scope.row.createDate">{{ dateFormat.format(scope.row.createDate, 'yyyy-MM-dd HH:mm:ss') }}</p>
                      <p v-else>--</p>
                  </template>
              </el-table-column>
              <el-table-column
                  label="内容"
                  width="220">
                  <template slot-scope="scope">
                      <div class="comment-content">
                        {{ scope.row.commentContent }}
                        <el-popover
                          v-if="getWidth(scope.row.commentContent) > 818"
                          placement="right"
                          width="300"
                          trigger="click">
                          <p class="popover-content">{{scope.row.commentContent}}</p>
                          <el-button class="comment-content-more" slot="reference" size="mini" type="text">查看全部</el-button>
                        </el-popover>
                      </div>
                  </template>
              </el-table-column>
              <el-table-column
                  label="打分"
                  width="160">
                  <template slot-scope="scope">
                      <el-rate
                        v-model="scope.row.score"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}分">
                      </el-rate>
                  </template>
              </el-table-column>
              <el-table-column label="图片" width="200">
                <template slot-scope="scope">
                  <ul class="comment-img">
                    <li v-for="(img, index) in scope.row.attachments.slice(0, 3)" v-bind:key="index" class="img">
                      <a @click="checkMore(scope.row.attachments)">
                        <img :src="ossPath + img.path" alt="评论图片">
                      </a>
                    </li>
                  </ul>
                  <p class="img-text">
                    <el-button type="text" size="mini" v-if="scope.row.attachments.length > 3" @click="checkMore(scope.row.attachments)">查看更多</el-button>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                  label="用户昵称">
                  <template slot-scope="scope">
                      <p>{{scope.row.nickName}}</p>
                  </template>
              </el-table-column>
              <el-table-column
                  label="评价门店">
                  <template slot-scope="scope">
                      <p>{{scope.row.shopName}}</p>
                  </template>
              </el-table-column>
              <el-table-column
                  label="所在地区">
                  <template slot-scope="scope">
                      <p>{{scope.row.shopAddr}}</p>
                  </template>
              </el-table-column>
              <el-table-column
                  label="审核状态">
                  <template slot-scope="scope">
                      <p>{{ handlApproveStatus(scope.row.approveStatus) }}</p>
                  </template>
              </el-table-column>
              <el-table-column
                  label="操作"
                  width="280">
                  <template slot-scope="scope">
                              <!-- v-if="scope.row.approveStatus !== 1" -->
                          <el-popover
                              placement="top"
                              width="190"
                              class="f-margin-right"
                              v-model="scope.row.visibleOfPass">
                              <p style="text-align: center;margin-bottom: 10px;">是否通过此评价？</p>
                              <p>通过评价后，此评价会在门店评价列表显示</p>
                              <div style="text-align: right; margin: 0">
                                  <el-button size="mini" type="text" @click="scope.row.visibleOfPass = false">取消</el-button>
                                  <el-button type="info" size="mini" @click="handlePass(scope.$index, scope.row, 0)">不通过</el-button>
                                  <el-button type="primary" size="mini" @click="handlePass(scope.$index, scope.row, 1)">通过</el-button>
                              </div>
                              <el-button
                                  slot="reference"
                                  size="mini"
                                  type="primary"
                                  @click="scope.row.visibleOfPass = true">审核</el-button>
                          </el-popover>
                          <!-- <el-button
                              v-if="scope.row.approveStatus !== 0"
                              size="mini"
                              type="info"
                              @click="handlePass(scope.$index, scope.row, 0)">
                              审核不通过
                          </el-button> -->
                      </template>
              </el-table-column>
          </el-table>
          <div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="commentListData.count">
            </el-pagination>
          </div>
        </div>
        <non-data v-else></non-data>
      </template>
    </Card>
    <el-dialog
      title=""
      :visible.sync="isCarouselShow"
      class="carousel-wrap"
      v-if="carouselImgs.length"
      top="0">
      <!-- :before-close="handleClose" -->
      <el-carousel :interval="5000" arrow="always" height="100vh">
        <el-carousel-item v-for="(item, index) in carouselImgs" :key="index">
          <div class="carouselImgs">
            <img :src="ossPath + item.path"/>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'
import dateFormat from 'element-ui/lib/utils/date'
import CURRENT_ENV_PATH from '../../../services/baseUrl'

import Card from '@/components/Card'
import NonData from '@/components/NonData'

const moduleComment = namespace('comment')
const moduleUser = namespace('user')

@Component({
  components: { Card, NonData }
})
export default class CommentList extends Vue {
  currentPage = 1
  currentSize = 10
  commentListData = null
  dateFormat = dateFormat
  loading = true
  ossPath = CURRENT_ENV_PATH.ossPath
  isCarouselShow = false
  carouselImgs = []

  @moduleComment.Action getShopCommentList
  @moduleComment.Action updateShopComment
  @moduleUser.Getter userInfo // 获取用户信息

  checkMore (list) {
    console.log(list)
    this.isCarouselShow = true
    this.carouselImgs = list
  }

  handlePass (index, row, isPass) {
    this.updateComment({ approveStatus: isPass, idList: [row.id] }, index)
  }

  updateComment (params, index) {
    this.updateShopComment(params).then(res => {
      // console.log(res)
      if (res.status) {
        this.$message.success('操作成功')
        this.commentListData.dataList[index].visibleOfPass = false
        this.renderCommentList()
      }
    })
  }

  handleSizeChange (val) {
    console.log(`每页 ${val} 条`)
    this.currentSize = val
    this.renderCommentList()
  }

  handleCurrentChange (val) {
    console.log(`当前页: ${val}`)
    this.currentPage = val
    this.renderCommentList()
  }

  handlApproveStatus (status) {
    switch (status) {
      case 0:
        return '审核不通过'
      case 1:
        return '审核通过'
      default:
        return '未审核'
    }
  }

  /*
  * param text 要获得长度的字符串
  * return 获得字符串实际字节长度，中文2，英文1
  */
  getLength (text) {
    let realLength = 0
    let charCode = -1
    const str = text.replace('.', '')
    for (const i in str) {
      charCode = str.charCodeAt(i)
      if (charCode >= 0 && charCode <= 128) realLength += 1
      else realLength += 2
    }
    return realLength
  }
  /*
  * param str 要获得宽度的字符串
  * return 获得字符串同样字符大小同样字体实际宽度
  */
  getWidth (str) {
    let span = document.createElement('span')
    // span.style.font = `${fontSize} ${fontSize}`
    // span.style.lineHeight = 1
    // span.style.display = 'none'
    span.style.display = 'inline-block'
    span.style.visibility = 'hidden'
    span.innerHTML = str
    document.body.appendChild(span)
    let rect = span.getBoundingClientRect()
    let width = rect.width
    // let height = rect.height
    document.body.removeChild(span)
    // console.log(str, width)
    return width
  }

  /*
  * param str 要截取的字符串
  * param leng 要截取的字节长度，注意是字节不是字符，一个汉字两个字节
  * return 截取后的字符串
  */
  getLengthStr (str, leng) {
    if (this.getLength(str) < leng) return str
    for (const i in str) {
      if (this.getLength(str.slice(0, i)) >= leng) {
        return str.slice(0, i)
      }
    }
  }

  renderCommentList (params) {
    const shopId = (this.userInfo && this.userInfo.shopId) || JSON.parse(sessionStorage.getItem('userInfo')).shopId
    const postData = Object.assign({ shopId: shopId, pageno: this.currentPage || 1, rowsize: this.currentSize || 10 }, params)
    this.loading = true
    this.getShopCommentList(postData).then(res => {
      this.loading = false
      if (res.status) {
        this.commentListData = res.data
      }
    })
  }

  created () {
    this.renderCommentList()
    // console.log(this.userInfo)
  }
}
</script>

<style src="./style.scss" lang="scss"></style>
