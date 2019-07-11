<template>
  <div v-loading="loading">
    <Card>
      <div slot="content" v-if="residualDetail">
        <div class="info-block">
          <h3 class="info-block__title">基本信息</h3>
          <ul>
            <li class="info-item">
              <span class="info-item__label">订单编号：</span>
              <span class="info-item__content">{{residualDetail.orderNo || '空'}}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">合同自编号：</span>
              <span class="info-item__content">{{residualDetail.factoryContractNo || '空'}}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">审核人：</span>
              <span class="info-item__content">{{residualDetail.checkedBy || '空'}}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">申请人：</span>
              <span class="info-item__content">{{residualDetail.createBy || '空'}}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">申请备注：</span>
              <span class="info-item__content">{{residualDetail.remark || '空'}}</span>
            </li>
          </ul>
        </div>
        <div class="info-block">
          <h3 class="info-block__title">遗留申报信息</h3>
          <ul v-for="(item, index) in residualDetail.list" v-bind:key="index" class="basic-info">
            <li class="info-item">
              <span class="info-item__label">申请原因：</span>
              <span class="info-item__content">{{ item.reason || '空' }}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">板材条码：</span>
              <span class="info-item__content">{{item.barcode || '空'}}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">合同自编号：</span>
              <span class="info-item__content">{{ item.platesContractNo || '空' }}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">规格：</span>
              <span class="info-item__content">{{ item.size || '空' }}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">名称：</span>
              <span class="info-item__content">{{ item.name || '空' }}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">颜色：</span>
              <span class="info-item__content">{{ item.color || '空' }}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">材料：</span>
              <span class="info-item__content">{{ item.material || '空' }}</span>
            </li>
          </ul>
        </div>
        <div class="info-block">
          <h3 class="info-block__title">遗留申报附件</h3>
          <ul class="info-list__imgcard">
            <li class="info-item__imgcard" v-for="(item, index) in residualDetail.attachmentList" v-bind:key="index">
              <span class="info-item__tag">
                <i>图</i>
              </span>
              <div class="flex-lay">
                <div class="img-wrap">
                  <img :src="ossPath + item.path" alt=""/>
                </div>
                <div class="content-wrap">
                  <p>{{item.name}}</p>
                  <el-button @click="onPreviewImage(item.path)" type="text">预览</el-button>
                  <el-button @click="onDownloadImage(item)" type="text">下载</el-button>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="info-block">
          <h3 class="info-block__title">处理意见</h3>
          <ul>
            <li class="info-item">
              <span class="info-item__label">审核结果：</span>
              <span class="info-item__content">{{ residualDetail.checkOpinion || '空'}}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">审核说明：</span>
              <span class="info-item__content">{{ residualDetail.checkExplain || '空'}}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">审核人：</span>
              <span class="info-item__content">{{ residualDetail.checkedBy || '空'}}</span>
            </li>
            <li class="info-item">
              <span class="info-item__label">审核时间：</span>
              <span class="info-item__content">{{ format(residualDetail.checkTime) }}</span>
            </li>
          </ul>
        </div>
        <div class="info-block">
          <h3 class="info-block__title">审核、转交审核历史记录</h3>
          <ul>
            <li v-for="(item, index) in residualDetail.checkHistory" :key="index" class="info-list">
              <span class="info-list__item">{{item.name}}</span>
              <span class="info-list__item">{{item.explain}}</span>
              <span class="info-list__item">审核说明：{{item.approval || '空'}}</span>
              <span class="info-list__item">{{ format(item.time) }}</span>
            </li>
            <!-- <li class="info-list">
              <span class="info-list__item">阳明</span>
              <span class="info-list__item">转交申请到王一;</span>
              <span class="info-list__item">审核说明：</span>
              <span class="info-list__item">2018-09-02 12：11:12</span>
            </li> -->
          </ul>
        </div>
      </div>
    </Card>
    <el-dialog :visible.sync="dialogVisible"
               :close-on-click-modal='false'
               :append-to-body='true'
               width="80%">
      <div class="img-preview">
        <img :src="dialogImageUrl" alt="">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ImgPreview from '@/components/ImgPreview'
import { Vue, Component } from 'vue-property-decorator'
import OSS from 'ali-oss'
import { namespace } from 'vuex-class'
import CURRENT_ENV_PATH from '@/services/baseUrl'
import { format, deliverySeparationFilter, statusFilter, brandFilter } from '@/utils/filter'
import Card from '@/components/Card'

// const orderDispatch = namespace('delivery-installation/order-dispatch-list')
const residual = namespace('delivery-installation/residual')
  @Component({
    components: { Card, ImgPreview },
    filters: { deliverySeparationFilter, format, statusFilter, brandFilter }
  })
export default class ResidualDetail extends Vue {
    loading = false
    dialogVisible = false
    dialogImageUrl = ''
    residualDetail = null
    ossPath = CURRENT_ENV_PATH.ossPath

    @residual.Action leaveDeclareDetail // 遗留单申请详情

    format (timestamp, fmt) { // 过滤时间戳
      return format(timestamp, 'yyyy-M-d HH:mm:s')
    }

    onPreviewImage (item = '') {
      console.log(item)
      this.dialogImageUrl = this.ossPath + item
      this.dialogVisible = true
    }

    handleSaveAsFile (path, name) {
      let filename = name
      let client = new OSS({
        region: 'oss-cn-shenzhen',
        accessKeyId: 'LTAIFBiMxe7OkNEi',
        secure: true, // 是否https
        accessKeySecret: 'cFcQhtxx3XHdOGGXdY4Dl4crGrkQqv',
        bucket: this.ossPath.indexOf('test') === -1 ? 'opyx-mtds-pro' : 'opyx-mtds-test'
      })
      let result = client.signatureUrl(path, {
        expires: 3600,
        response: {
          'content-disposition': 'attachment; filename="' + filename + '"'
        }
      })
      window.location.href = result
      // return result
    }

    onDownloadImage (item) {
      this.handleSaveAsFile(item.path, item.name)
    }

    renderDetail (params = {}) {
      this.leaveDeclareDetail(Object.assign({ orderIdentifier: this.$route.query.orderIdentifier }, params)).then(res => {
        if (res.status) {
          console.log(res)
          this.residualDetail = res.data
        }
      })
    }

    created () {
      this.renderDetail()
    }

    mounted () {
    }
  }
</script>
<style lang="scss">
  .info-block {
    .basic-info:not(:last-child) {
      border-bottom: 1px dashed #ccc;
    }
    &__title {
      font-size: 16px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 8px;
    }
    ul {
      padding-left: 0;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      li {
        list-style: none;
        margin-bottom: 8px;
      }
      .info-item {
        flex: 0 0 50%;
        margin-bottom: 8px;
        &__label {
          color: #555;
        }
      }
      .info-list {
        flex: 0 0 100%;
        &__item {
          margin-right: 15px;
        }
      }
    }
    ul.info-list__imgcard {
      justify-content: left;
      .info-item {
        &__imgcard {
          flex: 0 0 31%;
          // width: 430px;
          padding: 8px;
          position: relative;
          border: 1px solid #ccc;
          overflow: hidden;
          margin: 5px;
          .info-item__tag {
            position:absolute;
            bottom: -23px;
            left: -20px;
            width: 68px;
            height: 40px;
            font-size: 14px;
            background: #9c9c9c;
            display: block;
            transform: rotate(40deg);
            i {
              display: inline-block;
              font-style: normal;
              margin-left: 16px;
              margin-top: 2px;
              transform: rotate(-40deg);
              color: #fff;
            }
          }
          .flex-lay {
            display: flex;
            .img-wrap {
              // display: block;
              width: 60px;
              height: 80px;
              overflow: hidden;
              display: flex;
              justify-content: center;
              align-items: center;
              // padding: 8px;
              img {
                width: 100%;
              }
            }
            .content-wrap {
              flex: 1;
              overflow: hidden;
              margin-left: 8px;
              p {
                margin: 8px 0;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }
        }
      }
    }
  }
  .img-preview {
    display: flex;
    justify-content: center;
    image {
      max-width: 100%;
    }
  }
</style>
