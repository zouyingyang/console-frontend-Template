<template>
  <div>
    <Card v-loading="notConfirmLoading" class="fix-card">
      <h3 slot="head">设计方案</h3>
      <template v-if="confirmNotOkData" slot="content">
        <div v-if="confirmNotOkData.records.length">
          <el-row :gutter="20">
            <el-col :span="8" v-for="(o, index) in confirmNotOkData.records" :key="index" class="img-card">
              <el-card :body-style="{ padding: '0px' }" shadow="hover" class="img-wrap">
                <img v-if="o.img" :src="ossPath + o.img" class="image">
                <span v-else>暂无图片</span>
                <div class="img-title">
                  <p>{{o.name}}</p>
                </div>
              </el-card>
              <div class="button-wrap">
                <!-- <el-button type="text">二维码</el-button> -->
                <el-popover placement="top" width="140" v-model="o.qrcodeOfVisiable" class="f-margin">
                  <canvas :id="'qrccode-canvas' + o.id"></canvas>
                  <el-button slot="reference" type="text" @click="createQrc(o, index)">二维码</el-button>
                </el-popover>
                <el-button type="text" @click="showCarsel(o, index)">查看大图</el-button>
                <el-popover
                    placement="top"
                    width="190"
                    v-model="o.visibleOfConfirmTips"
                    class="f-margin">
                    <p style="text-align: center;margin-bottom: 10px;">推送此设计图给客户查看</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="o.visibleOfConfirmTips = false">点错，不推送</el-button>
                        <el-button type="primary" size="mini" @click="updateConfirmData(o, 1);o.visibleOfConfirmTips = false">确认推送</el-button>
                    </div>
                    <el-button
                      slot="reference"
                      type="text"
                      @click="o.visibleOfConfirmTips = true">推送</el-button>
                </el-popover>
              </div>
            </el-col>
          </el-row>
          <div class="l-right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleConfirmNotOkCurrentChange" :current-page.sync="confirmNotOkCurrentPage" :page-size="9" layout="total, prev, pager, next" :total="confirmNotOkData.total">
            </el-pagination>
          </div>
        </div>
        <non-data v-else></non-data>
      </template>
    </Card>
    <Card v-loading="confirmLoading" class="fix-card">
      <h3 slot="head">方案确认</h3>
      <template v-if="confirmOkData" slot="content">
        <div v-if="confirmOkData.records.length">
          <el-row :gutter="20">
            <el-col :span="8" v-for="(o, index) in confirmOkData.records" :key="index" class="img-card">
              <el-card :body-style="{ padding: '0px' }" shadow="hover" class="img-wrap">
                <img v-if="o.img" :src="ossPath + o.img" class="image">
                <span v-else>暂无图片</span>
                <div class="img-title">
                  <p>{{o.name}}</p>
                </div>
              </el-card>
              <div class="button-wrap">
                <!-- <el-button type="text">二维码</el-button> -->
                <el-popover placement="top" width="140" v-model="o.qrcodeOfVisiable" class="f-margin">
                  <canvas :id="'qrccode-canvas' + o.id"></canvas>
                  <el-button slot="reference" type="text" @click="createQrc(o, index)">二维码</el-button>
                </el-popover>
                <el-button type="text" @click="showCarsel(o, index)">查看大图</el-button>
                <!-- <el-button type="text" @click="updateConfirmData(o, 0)">不推送</el-button> -->
                <el-popover
                    placement="top"
                    width="190"
                    v-model="o.visibleOfConfirmTips"
                    class="f-margin">
                    <p style="text-align: center;margin-bottom: 10px;">确认撤回此设计方案?</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="o.visibleOfConfirmTips = false">点错，不撤回</el-button>
                        <el-button type="primary" size="mini" @click="updateConfirmData(o, 0);o.visibleOfConfirmTips = false">确认撤回</el-button>
                    </div>
                    <el-button
                      slot="reference"
                      type="text"
                      @click="o.visibleOfConfirmTips = true">不推送</el-button>
                </el-popover>
              </div>
            </el-col>
          </el-row>
          <div class="l-right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleConfirmOkCurrentChange" :current-page.sync="confirmOkCurrentPage" :page-size="9" layout="total, prev, pager, next" :total="confirmOkData.total">
            </el-pagination>
          </div>
        </div>
        <non-data v-else></non-data>
      </template>
    </Card>
    <el-dialog
      title=""
      :visible.sync="isCarouselShow"
      fullscreen
      class="carousel-wrap"
      v-if="carouselImgs.length">
      <!-- :before-close="handleClose" -->
      <el-carousel :interval="5000" arrow="always" @change="carouselChange" height="100vh">
        <el-carousel-item v-for="(item, index) in carouselImgs" :key="index">
          <div class="carouselImgs">
            <img :src="ossPath + item.path"/>
          </div>
        </el-carousel-item>
      </el-carousel>
      <p class="carousel-tag">
        {{ handleTypeName(carouselIndex) }}
        {{carouselIndex + 1}} / {{carouselImgs.length}}
      </p>
    </el-dialog>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import QRCode from 'qrcode' // 二维码
import CURRENT_ENV_PATH from '../../../../../services/baseUrl'

import Card from '@/components/Card'
import NonData from '@/components/NonData'

const moduleOrder = namespace('order')
const moduleUser = namespace('user')

@Component({
  components: { Card, NonData }
})
export default class Banner extends Vue {
  isSubmit = false
  ossPath = CURRENT_ENV_PATH.ossPath
  bigImgPath = CURRENT_ENV_PATH.ossPath + '?x-oss-process=style/big/'
  confirmOkCurrentPage = 1
  confirmNotOkCurrentPage = 1
  confirmOkData = null
  confirmNotOkData = null
  isCarouselShow = false
  carouselIndex = 0
  carouselImgs = []
  checkedCasesList = []
  notConfirmLoading = true
  confirmLoading = true
  isAuth = false // 是否有权限关联案例
  imgType = [{
    type: 'case_result',
    name: '效果图'
  }, {
    type: 'case_plane',
    name: '平面立体图'
  }, {
    type: 'case_ppt',
    name: '案例PPT'
  }, {
    type: 'case_design',
    name: '设计源文件'
  }, {
    type: 'case_designd',
    name: '设计源文件(3D)'
  }, {
    type: 'case_layout_plane',
    name: '户型平面图'
  }, {
    type: 'case_sj',
    name: '实景图'
  }, {
    type: 'case_aerial_view',
    name: '鸟瞰图'
  }, {
    type: 'case_panorama',
    name: '全景图'
  }]

  @moduleOrder.Action getOrderCaseListDetail
  @moduleOrder.Action getOrderCaseList
  @moduleOrder.Action updateOrderCases // 关联案例接口
  @moduleUser.Getter userInfo // 用户信息

  createQrc (o, index) {
    const canvas = document.getElementById('qrccode-canvas' + o.id)
    // this.qrcodeOfVisiable = !this.qrcodeOfVisiable
    // 显示隐藏二维码框，每一个
    console.log(`${CURRENT_ENV_PATH.appUrl}/design-detail2/${o.id}?share=1&origin=app`)
    QRCode.toCanvas(canvas, `${CURRENT_ENV_PATH.appUrl}/design-detail2/${o.id}?share=1&origin=app`, { width: 150 }, (error) => {
      if (error) {
        console.log(error)
      } else {
        console.log('success')
      }
    })
  }

  carouselChange (active, pre) {
    console.log(active, pre)
    this.carouselIndex = active
  }

  handleTypeName (index) { // 查图片类型的键对值
    for (const item of this.imgType) {
      if (item.type === this.carouselImgs[index].type) {
        return item.name
      }
    }
  }

  showCarsel (item, index) {
    this.isCarouselShow = true
    this.carouselIndex = 0
    // 过滤掉非 图片 的文件
    this.carouselImgs = item.fileAttahmentVoList.filter(item => {
      return ['.jpg', '.png', '.gif'].includes(item.suffix)
    })
  }

  handleSizeChange (val) {
    console.log(`每页 ${val} 条`)
  }

  handleConfirmOkCurrentChange (val) {
    console.log(`当前页: ${val}`)
    this.confirmOkCurrentPage = val
    this.renderDetailData({ pageNo: val, confirm: 1 })
  }

  handleConfirmNotOkCurrentChange (val) {
    console.log(`当前页: ${val}`)
    this.confirmNotOkCurrentPage = val
    this.renderDetailData({ pageNo: val, confirm: 0 })
  }

  renderOrderCasesList (params) { // 所有已关联的"精细"数据
    this.getOrderCaseList(params).then(res => {
      if (res.status) {
        this.checkedCasesList = res.data
      }
    })
  }

  updateConfirmData (item, val) {
    let params = {
      type: val ? 'push' : 'nonPush', // 推送还是不推送
      orderCaseList: []
    }
    params.orderCaseList = this.checkedCasesList.reduce((pre, cur) => {
      if (item.id === cur.caseId) {
        cur.confirm = val
      }
      pre.push(cur)
      return pre
    }, [])
    this.checkedCasesList = params.orderCaseList // 修正已关联的案例数值，不必要再请求一次
    // console.log(item.id, this.checkedCasesList)
    this.updateOrderCases(params).then(res => {
      console.log(res)
      if (res.status) {
        this.$message.success('操作成功')
        this.renderDetailData({ pageNo: 1, confirm: 0 })
      }
    })
  }

  renderDetailData (params) {
    console.log(params.confirm)
    this.getOrderCaseListDetail(Object.assign(params, { orderId: this.$route.params.id, pageSize: 9 })).then(res => {
      if (params.confirm) {
        this.confirmLoading = false
      } else {
        this.notConfirmLoading = false
      }
      if (res.status) {
        if (params.confirm) {
          this.confirmOkData = res.data
        } else {
          // console.log(res.data)
          this.confirmNotOkData = res.data
          this.renderDetailData({ pageNo: 1, confirm: 1 })
        }
      } else {
        this.$message('请求失败或者数据结构发生变化，请联系开发人员。')
      }
    })
  }

  created () {
    console.log(this.$route.params.id, this.userInfo)
    this.renderDetailData({ pageNo: 1, confirm: 0 })
    this.renderOrderCasesList({ orderId: this.$route.params.id })
  }
}
</script>
// 用scope 私有化的话，无法修改 elementui 本来的样式，此页面主要是针对 elementui 的对话框，去掉背景颜色
<style src="./style.scss" lang="scss"></style>
