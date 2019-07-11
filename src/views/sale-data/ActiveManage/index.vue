<template>
  <div class="activeManage">
    <Card v-if="$route.path === '/sale-data/data-manage'">
      <div class="header" slot="head">
        <div class="header-toolbar">
          <div>
            <el-button type="primary" size="mini" @click="addActivity" v-if="checkPermission('createCollectionActivityBtn')">创建促销活动</el-button>
            <el-dialog
              :title="isNew?'创建促销活动':'修改促销活动'"
              :visible.sync="dialogFormVisible"
              :close-on-click-modal="false"
              @close="closeDialogForm">
              <el-form :model="dialogform">
                <div style="display:flex">
                  <el-form-item
                    style="width:330px"
                    label="品牌品类："
                    size='mini'
                    :rules="[{required: true}]">
                    <el-select v-model="dialogform.brandCategory" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="活动状态："
                    label-width='100px'
                    size='mini'
                    :rules="[{required: true}]">
                    <el-radio v-model="dialogform.status" label="enable">启用</el-radio>
                    <el-radio v-model="dialogform.status" label="prohibit">禁用</el-radio>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item
                    label="活动名称："
                    size='mini'
                    :rules="[{required: true}]">
                    <el-input
                      maxlength="20"
                      size="mini"
                      placeholder="请输入活动名称"
                      v-model="dialogform.collectionActivityName"
                      clearable
                      style="width:193px;"
                    >
                    </el-input>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item
                    label="活动资料填报类型："
                    size='mini'
                    :rules="[{required: true}]"
                    >
                    <el-radio v-model="dialogform.fillingType" label="single" :disabled="!isNew" >单次填报</el-radio>
                    <el-radio v-model="dialogform.fillingType" label="multiple" :disabled="!isNew">多次填报</el-radio>
                  </el-form-item>
                </div>
                <div style="display:flex;">
                  <el-form-item
                    style="display:flex;"
                    label="填报开始日期："
                    size='mini'
                    :rules="[{required: true}]">
                    <el-date-picker
                      :disabled="ableStartDate"
                      :picker-options="stratPickerOptions"
                      value-format="timestamp"
                      style="width:170px;"
                      v-model="dialogform.fillingStartDt"
                      type="date"
                      placeholder="选择开始日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item
                    style="display:flex;margin-left:20px;"
                    label="填报结束日期："
                    size='mini'
                    :rules="[{required: true}]">
                    <el-date-picker
                      :picker-options="endPickerOptions"
                      value-format="timestamp"
                      style="width:170px;"
                      v-model="dialogform.fillingEndDt"
                      type="date"
                      placeholder="选择结束日期">
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item
                    label="备 注："
                    size='mini'
                    label-width="120px"
                    >
                    <el-input
                      style="width:260px;"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入内容"
                      v-model="dialogform.remark">
                    </el-input>
                  </el-form-item>
                </div>
                <div style="text-align:center;">
                  <el-button type="primary" size="mini" @click="newActivity" v-if="isNew">保存</el-button>
                  <el-button type="primary" size="mini" @click="editActivityFn" v-else-if="!isNew">保存</el-button>
                  <el-button type="primary" size="mini" @click="closeDialogForm">返回</el-button>
                </div>
              </el-form>
            </el-dialog>
          </div>
          <div class="search-form">
            <el-input
              maxlength="20"
              size="mini"
              placeholder="搜索活动名称"
              v-model="searchKeyword"
              clearable
              @clear="search"
              @keyup.enter.native="search"
              class="searchInput"
            >
            </el-input>
            <el-button type="primary" size="mini" @click="search">搜索</el-button>
          </div>
        </div>
      </div>
      <div slot="content">
        <el-table
          border
          v-loading="loading"
          :data="tableData"
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
            width="100px"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="collectionActivityName"
            label="促销活动名称"
            >
          </el-table-column>
          <el-table-column
            prop="fillingStartDt"
            align="center"
            label="填报开始日期"
            width="100px"
            >
            <template slot-scope="scope">
              {{scope.row.fillingStartDt | format("yyyy-MM-dd")}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="fillingEndDt"
            label="填报结束日期"
            width="100px"
            >
            <template slot-scope="scope">
              {{scope.row.fillingEndDt | format("yyyy-MM-dd")}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="fillingType"
            label="活动资料填报类型"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.fillingType == 'single'">单次填报</span>
              <span v-else-if="scope.row.fillingType == 'multiple'">多次填报</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="资料填报名称"
            prop="dataFillingName"
            width="140px"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span v-if="scope.row.fillingType == 'single'">X展架、橱窗、地贴、吊旗、其他1、其他2</span>
              <span v-else-if="scope.row.fillingType == 'multiple'">预约单签订时间、客户姓名、手机号码、安装地址、收款金额、预约单照片、收据照片、成交凭证、成交现场照片、其他1、其他2、补贴赠品型号、家配套餐合同单号、是否属于家配联购客户、订单产品系列、备注</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="资料类型"
            prop="dataType"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.fillingType == 'single'">照片</span>
              <span v-else-if="scope.row.fillingType == 'multiple'">照片/文本</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="资料填报数量（必填）"
            prop="mustDataNumber"
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="资料填报数量（选填）"
            prop="optionalDataNumber"
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="备注"
            prop="remark"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="状态"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'enable'">启动</span>
              <span v-else-if="scope.row.status == 'prohibit'">禁用</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="250"
            fixed="right"
            >
            <template
            slot-scope="scope"
            v-loading="scope.row.loading"
            >
              <el-button type="text" size="mini"
                @click="handleEdit(scope.row)"
                v-if="checkPermission('updateCollectionActivityBtn')"
              >
                修改
              </el-button>
              <el-button type="text" size="mini"
                @click="goto(scope.row,'detail')"
                v-if="checkPermission('getCollectionActivityDetailBtn')"
              >
                详情
              </el-button>
              <el-button type="text" size="mini"
                @click="statusChange(scope.row)"
                :disabled="scope.row.isAble"
                v-if="scope.row.status === 'prohibit' && checkPermission('startUpCollectionActivityBtn')"
              >
                启动
              </el-button>
              <el-button type="text" size="mini"
                @click="statusChange(scope.row)"
                :disabled="scope.row.isAble"
                v-if="scope.row.status === 'enable' && checkPermission('startUpCollectionActivityBtn')"
              >
                禁用
              </el-button>
              <el-button type="text" size="mini"
                @click="goto(scope.row,'verify')"
                v-if="checkPermission('getActivityAuditDetailBtn')"
              >
                明细审核
              </el-button>
              <el-button type="text" size="mini" @click="exportFile(scope.row)"
                :disabled="scope.row.isExport"
                v-if="checkPermission('ActivityAuditDetailExportBtn')"
                >
                明细导出
              </el-button>
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
    <router-view></router-view>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Card from '@/components/Card'
import { namespace } from 'vuex-class'
import { format } from '@/utils/filter'
import { SaveAsFile } from '@/utils/lib'

const saleDataModule = namespace('sale-data/index')
const moduleUser = namespace('user')

@Component({
  components: { Card },
  filters: { format, SaveAsFile }
})
export default class ActiveManage extends Vue {
  loading = false
  searchKeyword = ''
  tableData = []
  currentPage = 1
  totalSize = 0
  isNew = true
  dialogFormVisible= false
  dialogform = {
    brandCategory: null, // 下拉选中项
    status: 'enable',
    remark: '',
    collectionActivityName: '',
    fillingEndDt: null,
    fillingStartDt: null
  }
  options = []
  userBrandList = [] // 用户的品牌品类
  ableStartDate = false // 开始时间是否可以使用
  fillingStartDt = ''
  fillingEndDt = ''
  @saleDataModule.Action findBrandCategory
  @saleDataModule.Action getActivityList
  @saleDataModule.Action createActivity
  @saleDataModule.Action editActivity
  @saleDataModule.Action exportActivity
  @saleDataModule.Action editStatus

  // @moduleUser.Getter('userInfo') userInfo
  // 权限控制
  @moduleUser.Getter permission

  mounted () {
    console.log(process.env)
  }
  async created () {
    await this.loadUserOptions()
    await this.getData(false)
    const query = this.$route.query
    this.searchKeyword = query.activityName ? query.activityName : ''
  }
  // 判断是否拥有权限
  checkPermission (permissionStr) {
    if (!this.permission || this.permission === null || this.permission === undefined) {
      return false
    } else {
      return this.permission.indexOf(permissionStr) > -1
    }
  }

  // 开始时间选择限制规则
  stratPickerOptions = {
    disabledDate: (date) => {
      const dateTimestamp = date.getTime()
      const nowDate = Date.now()
      if ((nowDate - dateTimestamp) >= 86400000) {
        return true
      }
      if (this.dialogform.fillingEndDt) {
        const endDate = new Date(this.dialogform.fillingEndDt).getTime()
        if (dateTimestamp > endDate) {
          return true
        }
      }
    }
  }
  endPickerOptions = {
    disabledDate: (date) => {
      const dateTimestamp = date.getTime()
      const nowDate = Date.now()
      if ((nowDate - dateTimestamp) >= 86400000) {
        return true
      }
      if (this.dialogform.fillingStartDt) {
        const startDate = new Date(this.dialogform.fillingStartDt).getTime()
        if (dateTimestamp < startDate) {
          return true
        }
      }
    }
  }
  async loadUserOptions () {
    if (this.userBrandList.length) {
      return
    }
    await this.findBrandCategory().then(result => {
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
          return
        }
        brands.forEach((item) => {
          const optionItem = {}
          optionItem.value = `${item.brandCode}\\${item.categoryCode}`
          optionItem.label = `${item.brandName} - ${item.categoryName}`
          this.options.push(optionItem)
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  // 关闭表单弹窗
  closeDialogForm () {
    this.dialogFormVisible = false
    this.$set(this.dialogform, 'brandCategory', null)
    this.$set(this.dialogform, 'status', 'enable')
    this.$set(this.dialogform, 'remark', '')
    this.$set(this.dialogform, 'collectionActivityName', '')
    this.$set(this.dialogform, 'fillingStartDt', null)
    this.$set(this.dialogform, 'fillingEndDt', null)
  }
  // 禁用或者启用
  statusChange (row) {
    this.$set(row, 'isAble', true)
    this.editStatus({
      id: row.id,
      status: row.status === 'enable' ? 'prohibit' : 'enable'
    }).then((result) => {
      console.log('>>>>', result)
      if (result.code === '200') {
        this.$message({
          title: '',
          showClose: true,
          message: '修改成功',
          type: 'success',
          duration: 1200
        })
        this.getData(false)
      }
      this.$set(row, 'isAble', true)
    }).catch((err) => {
      this.$set(row, 'isAble', true)
      console.log(err)
    })
  }
  // 搜索
  search () {
    this.currentPage = 1
    this.getData(true)
  }
  // 请求数据
  getData (bool) {
    this.loading = true
    if (bool) {
      this.$router.push({ query: {
        activityName: this.searchKeyword
      } })
    }
    this.getActivityList({
      pageNum: this.currentPage,
      pageSize: 20,
      activityName: this.searchKeyword
    }).then((result) => {
      console.log('getActivityList', result)
      this.totalSize = result.data.total
      const list = result.data.list
      this.userBrandList.forEach((item) => {
        list.forEach((listItem, index) => {
          if (item.brandCode === listItem.brand && item.categoryCode === listItem.category) {
            list[index].brandCategory = item.brandName + '-' + item.categoryName
          }
        })
      })
      this.loading = false
      this.tableData = list
    }).catch((err) => {
      console.log(err)
      this.loading = false
    })
  }

  // 路由跳转
  goto (row, type) {
    console.log(type)
    if (row.fillingType === 'single') {
      this.$router.push({
        name: 'single-verify',
        query: {
          type: type,
          id: row.id
        }
      })
    }
    if (row.fillingType === 'multiple') {
      this.$router.push({
        name: 'multiple-verify',
        query: {
          type: type,
          id: row.id
        }
      })
    }
  }
  // 导出文件
  exportFile (row) {
    console.log(row)
    const msgTips = this.$message({
      showClose: true,
      message: '正在下载，请稍等...',
      type: 'success',
      duration: 0
    })
    this.$set(row, 'isExport', true)
    this.exportActivity({
      fillingType: row.fillingType,
      activityId: row.id
    }).then((result) => {
      console.log(result)
      if (result.code === '200') {
        SaveAsFile(result.data).then((res) => {
          if (res) {
            this.$set(row, 'isExport', false)
          }
          msgTips.close()
          console.log(res)
        }).catch((err) => {
          console.log(err)
          this.$message({
            showClose: true,
            message: '系统出错，无法下载',
            type: 'error',
            duration: 2000
          })
          this.$set(row, 'isExport', false)
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  // 添加活动按钮
  addActivity () {
    this.ableStartDate = false
    this.options.length === 0 && this.loadUserOptions()
    this.dialogFormVisible = true
    this.isNew = true
  }
  checkData () {
    if (this.dialogform.fillingEndDt) {
      const dateString = new Date(this.dialogform.fillingEndDt).toDateString()
      const timestamp = new Date(dateString).getTime()
      this.dialogform.fillingEndDt = timestamp + (60 * 60 * 24 * 1000 - 1000)
    }
    // 验证表单数据是否为空
    const bool = this.dialogform.brandCategory &&
                this.dialogform.status &&
                this.dialogform.collectionActivityName &&
                this.dialogform.fillingType &&
                this.dialogform.fillingStartDt &&
                this.dialogform.fillingEndDt
    if (this.dialogform.collectionActivityName.length > 16) {
      this.$message({
        title: '警告',
        showClose: true,
        message: '活动名称不能超过16个字符',
        type: 'warning',
        duration: 1200
      })
      return false
    }
    if (this.dialogform.remark.length > 99) {
      this.$message({
        title: '警告',
        showClose: true,
        message: '备注内容不能超过99个字符',
        type: 'warning',
        duration: 1200
      })
      return false
    }
    if (!bool) {
      this.$message({
        title: '警告',
        showClose: true,
        message: '必填项不能为空',
        type: 'warning',
        duration: 1200
      })
      return false
    }
    if (((Date.now() - this.dialogform.fillingStartDt) > 86400000) && !this.ableStartDate) {
      this.$message({
        title: '警告',
        showClose: true,
        message: '不能选择今天以前的日期',
        type: 'warning',
        duration: 1200
      })
      return false
    }
    if (this.dialogform.fillingStartDt > this.dialogform.fillingEndDt) {
      this.$message({
        title: '警告',
        showClose: true,
        message: '填报开始日期必须小于填报结束日期',
        type: 'warning',
        duration: 1200
      })
      return false
    }
    return true
  }
  // 创建活动
  newActivity () {
    console.log(this.dialogform)
    const bool = this.checkData()
    if (!bool) {
      return
    }
    const brandCategory = this.dialogform.brandCategory
    const valueArr = brandCategory ? brandCategory.split('\\') : ''
    const params = {
      brand: valueArr[0],
      category: valueArr[1],
      status: this.dialogform.status,
      collectionActivityName: this.dialogform.collectionActivityName,
      fillingType: this.dialogform.fillingType,
      mustDataNumber: this.dialogform.fillingType === 'single' ? 4 : 9,
      optionalDataNumber: this.dialogform.fillingType === 'single' ? 2 : 7,
      fillingStartDt: this.dialogform.fillingStartDt,
      fillingEndDt: this.dialogform.fillingEndDt,
      remark: this.dialogform.remark
    }
    console.log(params)
    this.createActivity(params).then((result) => {
      console.log(result)
      if (result.code === '200') {
        this.$message({
          title: '',
          showClose: true,
          message: '创建成功',
          type: 'success',
          duration: 1200
        })
        this.getData(false)
      }
      this.closeDialogForm()
    }).catch((err) => {
      console.log(err)
    })
  }
  editActivityFn () {
    console.log(this.dialogform)
    const bool = this.checkData()
    if (!bool) {
      return
    }
    const brandCategory = this.dialogform.brandCategory
    const valueArr = brandCategory ? brandCategory.split('\\') : ''
    const params = {
      brand: valueArr[0],
      category: valueArr[1],
      id: this.dialogform.id,
      status: this.dialogform.status,
      collectionActivityName: this.dialogform.collectionActivityName,
      fillingType: this.dialogform.fillingType,
      mustDataNumber: this.dialogform.fillingType === 'single' ? 4 : 9,
      optionalDataNumber: this.dialogform.fillingType === 'single' ? 2 : 6,
      fillingStartDt: this.dialogform.fillingStartDt,
      fillingEndDt: this.dialogform.fillingEndDt,
      remark: this.dialogform.remark
    }
    console.log(params)
    this.editActivity(params).then((result) => {
      console.log(result)
      if (result.code === '200') {
        this.$message({
          title: '',
          showClose: true,
          message: '修改成功',
          type: 'success',
          duration: 1200
        })
        this.getData(false)
      }
      this.closeDialogForm()
    }).catch((err) => {
      console.log(err)
    })
  }

  // 修改
  handleEdit (row) {
    console.log(row)
    console.log(this.dialogform)
    const dateNow = Date.now()
    this.ableStartDate = (dateNow > row.fillingStartDt)
    this.options.length === 0 && this.loadUserOptions()
    this.isNew = false
    this.dialogform = Object.assign({}, this.dialogform, row)
    this.userBrandList.forEach((item) => {
      if (item.brandCode === row.brand && item.categoryCode === row.category) {
        this.dialogform.brandCategory = `${item.brandCode}\\${item.categoryCode}`
      }
    })
    this.dialogFormVisible = true
  }

  // 处理翻页
  handleCurrentChange (val) {
    this.currentPage = val
    this.getData(false)
  }
}
</script>

<style src="./style.scss" lang="scss" scoped></style>
