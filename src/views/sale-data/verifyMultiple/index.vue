<template>
  <div class="verifyMultiple">
    <Card>
      <div class="header" slot="head">
        <div class="header-toolbar">
          <el-form :model="searchForm" inline>
            <el-form-item
              style=""
              label="商场名称"
              size='mini'
            >
              <el-input
                style="width:150px;"
                placeholder="请输入内容"
                v-model="searchForm.orgName">
              </el-input>
            </el-form-item>
            <el-form-item
              style=""
              label="店面名称"
              size='mini'
            >
              <el-input
                style="width:150px;"
                placeholder="请输入内容"
                v-model="searchForm.shopName">
              </el-input>
            </el-form-item>
            <el-form-item
              label="审核状态"
              size='mini'
            >
              <el-select
                @change="changeHandle"
                v-model="searchForm.auditStatus"
                placeholder="请选择审核状态"
                style="width:150px;">
                <el-option
                  v-for="item in StateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              style=""
              label="审核结果"
              size='mini'
            >
              <el-select
                :disabled="isable"
                v-model="searchForm.auditResult"
                placeholder="请选择审核结果"
                style="width:150px;">
                <el-option
                  v-for="item in resultOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="getData">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="content">
        <el-table
          :data="tableData"
          border
          v-loading="loading"
        >
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            align="center"
            prop="brandCategory"
            label="品牌品类"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="department"
            label="所属部门"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="belongClassify"
            label="所属线别"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="provinces"
            label="所属省份"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="orgName"
            label="商场名称"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="orgManagerName"
            label="商场管理员"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="shopName"
            label="店面名称"
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="预约单签订时间"
            >
            <template slot-scope="scope">
              {{scope.row.bookOrderSignDate | format("yyyy-MM-dd")}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="customerName"
            label="客户姓名"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="customerTel"
            label="手机号码"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="installAddress"
            label="安装地址"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="payAmount"
            label="收款金额（元）"
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="预约单"
            prop="bookingForm"
            width="120px"
            >
            <template slot-scope="scope">
              <div v-if="scope.row.bookingForm" class="imgBlock"
                @click="enlargeImg(scope.row.bookingForm)"
              >
                <img :src="scope.row.bookingForm" style="width:100px;height:100px;"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="receipt"
            label="收据"
            width="120px"
            >
            <template slot-scope="scope">
              <div v-if="scope.row.receipt" class="imgBlock"
                @click="enlargeImg(scope.row.receipt)"
              >
                <img :src="scope.row.receipt" style="width:100px;height:100px;"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="paymentVoucher"
            label="交款凭证"
            width="120px"
            >
            <template slot-scope="scope">
              <div v-if="scope.row.paymentVoucher" class="imgBlock"
                @click="enlargeImg(scope.row.paymentVoucher)"
              >
                <img :src="scope.row.paymentVoucher" style="width:100px;height:100px;"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="transactionSitePhoto"
            label="成交现场照片"
            width="120px"
            >
            <template slot-scope="scope">
              <div v-if="scope.row.transactionSitePhoto" class="imgBlock"
                @click="enlargeImg(scope.row.transactionSitePhoto)"
              >
                <img :src="scope.row.transactionSitePhoto" style="width:100px;height:100px;"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="其他1"
            width="120px"
            >
            <template slot-scope="scope">
              <div v-if="scope.row.other" class="imgBlock"
                @click="enlargeImg(scope.row.other)"
              >
                <img :src="scope.row.other" style="width:100px;height:100px;"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="其他2"
            width="120px"
            >
            <template slot-scope="scope">
              <div v-if="scope.row.other2" class="imgBlock"
                @click="enlargeImg(scope.row.other2)"
              >
                <img :src="scope.row.other2" style="width:100px;height:100px;"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="giftModel"
            label="补贴赠品型号"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="homePurchaseContractNo"
            label="家配套餐合同单号"
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="是否属于家配联购客户"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.homePurchaseCustomer === true">是</span>
              <span v-if="scope.row.homePurchaseCustomer === false">否</span>
              <span v-if="scope.row.homePurchaseCustomer === null"></span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="orderProduct"
            label="订单产品系列"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="remarks"
            label="备注"
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="审核状态"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.auditStatus==='audited'">已审核</span>
              <span v-if="scope.row.auditStatus==='auditing'">未审核</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="审核结果"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.auditResult==='pass'">通过</span>
              <span v-if="scope.row.auditResult==='reject'">驳回</span>
              <span v-if="scope.row.auditResult==='auditing'">待审核</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="审核意见"
            prop="auditOpinion"
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="审核"
            width="220"
            fixed="right">
            <template slot-scope="scope">
              <div>
                <el-input
                  resize="none"
                  :rows="2"
                  type="textarea"
                  placeholder="请输入内容"
                  :disabled="routeQuery.type !== 'verify' || scope.row.auditResult ==='pass' || !checkPermission('getActivityAuditDetailBtn')"
                  v-model="scope.row.verifyText"
                ></el-input>
              </div>
              <div>
                <el-button type="text" size="mini"
                  @click="verify(scope.row,'pass')"
                  :disabled="routeQuery.type !== 'verify' || scope.row.auditResult ==='pass' || !checkPermission('getActivityAuditDetailBtn')"
                >
                  通过
                </el-button>
                <el-button type="text" size="mini"
                  @click="verify(scope.row,'reject')"
                  :disabled="routeQuery.type !== 'verify' ||
                            scope.row.auditResult ==='pass' ||
                            !checkPermission('getActivityAuditDetailBtn') ||
                            scope.row.auditResult==='reject'"
                >
                  驳回
                </el-button>
              </div>
              <div>
                <el-button type="text" @click="checkRecords(scope.row)">查看历史审核记录</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
      slot="foot"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize">
    </el-pagination>
    </Card>
    <el-dialog
      title="历史审核记录"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      >
      <div>
        <el-table
          :data="recordsData"
          v-loading="recordLoading"
          height="200"
          border
        >
           <el-table-column
            align="center"
            prop="auditStep"
            label="审批步骤"
            >
          </el-table-column>
          <el-table-column
            prop="creator"
            align="center"
            label="处理人"
            >
          </el-table-column>
          <el-table-column
            prop="orgNo"
            align="center"
            label="组织编码"
            >
          </el-table-column>
          <el-table-column
            prop="auditorAccount"
            align="center"
            label="账号"
            >
          </el-table-column>
          <el-table-column
            prop="createDt"
            align="center"
            label="处理时间"
            >
            <template slot-scope="scope">
              {{scope.row.createDt | format("yyyy-MM-dd HH:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="审批结果"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.auditResult==='pass'">通过</span>
              <span v-if="scope.row.auditResult==='reject'">驳回</span>
              <span v-if="scope.row.auditResult==='auditing'">待审核</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="auditOpinion"
            align="center"
            label="审批意见"
            >
          </el-table-column>
        </el-table>
      </div>
      <p slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >返 回</el-button>
      </p>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="dialogImg"
      :close-on-click-modal="false"
      >
      <div class="dialog-img">
        <img :src="dialogImgUrl"/>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator'
import Card from '@/components/Card'
import { namespace } from 'vuex-class'
import { format } from '@/utils/filter'

const saleDataModule = namespace('sale-data/index')
const moduleUser = namespace('user')
@Component({
  components: { Card },
  filters: { format }
})
export default class VerifyMultiple extends Vue {
  loading = false
  recordLoading = false
  currentPage = 1
  totalSize = 0
  dialogVisible = false
  searchForm = {
    shopName: '',
    orgName: '',
    auditResult: '',
    auditStatus: ''
  }
  routeQuery = null

  computed = {}

  recordsData = []
  tableData = []
  StateOptions = [
    { value: '', label: '全部' },
    { value: 'audited', label: '已审核' },
    { value: 'auditing', label: '待审核' }
  ]
  resultOptions = [
    { value: '', label: '全部' },
    { value: 'pass', label: '通过' },
    { value: 'reject', label: '驳回' }
  ]
  dialogImg = false
  dialogImgUrl = '' // 点击放大图片地址
  isable = false // 选择器是否可用
  userBrandList = []

  @saleDataModule.Action findBrandCategory
  @saleDataModule.Action getMultipleAuditDetailByCondition
  @saleDataModule.Action getAuditHistoryByCondition
  @saleDataModule.Action auditMultipleAuditDetail
  // 权限控制
  @moduleUser.Getter permission
  async mounted () {
    await this.loadBrandCategory()
    await this.getData()
  }
  created () {
    this.routeQuery = this.$route.query
  }
  // 下载用户品牌品类
  loadBrandCategory () {
    if (this.userBrandList.length) {
      return
    }
    this.findBrandCategory().then((result) => {
      console.log('findBrandCategory', result)
      if (result.code === '200') {
        const brands = result.data
        this.userBrandList = [...brands]
        if (!brands || brands.length === 0) {
          this.$message({
            title: '',
            showClose: true,
            message: '当前用户没有权限',
            type: 'error',
            duration: 1200
          })
        }
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  // 判断是否拥有权限
  checkPermission (permissionStr) {
    if (!this.permission || this.permission === null || this.permission === undefined) {
      return false
    } else {
      return this.permission.indexOf(permissionStr) > -1
    }
  }
  // 选择器处理
  changeHandle (val) {
    if (val === 'auditing') {
      this.isable = true
      this.searchForm.auditResult = ''
    } else {
      this.isable = false
    }
  }
  // 放大图片
  enlargeImg (url) {
    console.log(url)
    this.dialogImg = true
    this.dialogImgUrl = url
  }
  // 列表数据
  getData () {
    this.loading = true
    this.getMultipleAuditDetailByCondition({
      pageNum: this.currentPage,
      pageSize: 20,
      collectionActivityId: this.routeQuery.id,
      auditResult: this.searchForm.auditResult,
      auditStatus: this.searchForm.auditStatus,
      orgName: this.searchForm.orgName,
      shopName: this.searchForm.shopName
    }).then((result) => {
      console.log('getData>>>>', result)
      if (result.code === '200') {
        this.totalSize = result.data.total
        const list = result.data.list
        this.userBrandList.forEach((item) => {
          list.forEach((listItem, index) => {
            if (item.brandCode === listItem.brand && item.categoryCode === listItem.category) {
              list[index].brandCategory = item.brandName + '-' + item.categoryName
            }
          })
        })
        this.tableData = list
      }
      this.loading = false
    }).catch((err) => {
      console.log(err)
      this.loading = false
    })
  }
  verify (row, res) {
    console.log(row)
    this.loading = true
    this.auditMultipleAuditDetail({
      auditOpinion: row.verifyText,
      auditResult: res,
      id: row.id
    }).then((result) => {
      console.log(result)
      if (result.code === '200') {
        this.$message({
          title: '',
          showClose: true,
          message: result.message,
          type: 'success',
          duration: 1200
        })
        this.getData()
      }
      this.loading = false
    }).catch((err) => {
      this.loading = false
      console.log(err)
    })
  }
  // 处理翻页
  handleCurrentChange (val) {
    this.currentPage = val
    this.getData()
    // console.log('val :', val)
  }

  // 查看历史审核记录
  checkRecords (row) {
    this.dialogVisible = true
    this.recordLoading = true
    console.log(row)
    this.getAuditHistoryByCondition({
      auditDetailId: row.id
    }).then((result) => {
      console.log(result)
      if (result.code === '200') {
        const list = result.data
        this.recordsData = list
      }
      this.recordLoading = false
    }).catch((err) => {
      this.recordLoading = false
      console.log(err)
    })
  }
}
</script>
<style src="./style.scss" lang="scss" scoped></style>
