<template>
  <div v-loading="loading" class="loading-wrap">
    <!-- <Card>
      <template slot="head">
        <span>我的服务单</span>
        <div>
        </div>
      </template>
    </Card> -->

    <Card class="fix-card">
      <template slot="head">
        <span></span>
        <el-row justify="end" :gutter="20">
          <el-col :span="16">
            <el-input maxlength="50" v-model="searchOrderKey" clearable size="mini" placeholder="请输入搜索内容"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button size="mini" type="primary" @click="searchTableData">搜索</el-button>
          </el-col>
        </el-row>
      </template>
      <template v-if="tableData" slot="content">
        <div v-if="tableData.records.length">
          <el-table border :data="tableData.records" style="width: 100%">
            <el-table-column label="服务单号">
              <template slot-scope="scope">
                <span>{{ scope.row.no }}</span>
              </template>
            </el-table-column>
            <el-table-column label="服务号">
              <template slot-scope="scope">
                <span>{{ scope.row.serviceNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- <el-button type="text" size="mini" @click="goUrl({ name: 'my-order-detail', params: { id: '2c908bff656b2d5801656b40127701ca' }})"> -->
                <el-button type="text" size="mini" @click="goUrl({ name: 'my-order-detail', params: { id: scope.row.id }})">
                  查看
                </el-button>
                <el-button type="text" size="mini" @click="goUrl({ name: 'feekback', params: { id: scope.row.id }})">
                  客户反馈
                </el-button>
                <el-button v-if="isAuth" type="text" size="mini" @click="openDialog(scope.$index, scope.row)">关联案例</el-button>
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
              :total="tableData.total">
            </el-pagination>
          </div>
        </div>
        <non-data v-else></non-data>
      </template>
    </Card>

    <el-dialog class="case-wrap" title="我的设计图" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" :close-on-click-modal="false">
      <el-row class="search-buttons row-bg" type="flex" justify="end" :gutter="20">
        <el-col :span="20">
          <el-input maxlength="50" v-model="searchCaseKey" clearable size="mini" placeholder="请输入搜索内容"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button size="mini" type="primary" @click="onSearchCases">搜索</el-button>
        </el-col>
      </el-row>
      <!-- 等待已关联案例数据回来后 checkedCasesList 再去渲染表格 -->
      <div v-if="caseData && checkedCasesList">
        <el-table
          v-loading="caseLoading"
          border
          :data="caseData.records"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            :selectable="checkSelectable"
            width="55">
          </el-table-column>
          <el-table-column label="封面图">
            <template slot-scope="scope">
              <div v-if="scope.row.img" class="img-wrap">
                <img :src="ossPath + scope.row.img" :alt="scope.row.name">
              </div>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column label="方案名">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span v-if="scope.row.createDt">{{ dateFormat.format(scope.row.createDt, 'yyyy-MM-dd HH:mm:ss') }}</span>
              <span v-else>{{ dateFormat.format(scope.row.createDt, 'yyyy-MM-dd HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="checkSelectable(scope.row)"
                :disabled="!!selcectedCases.length"
                type="text"
                size="mini"
                @click="onRelatedCase(scope.row, 'checked')">
                关联案例
              </el-button>
              <span v-else>已关联</span>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-pagination
            @size-change="handleCaseSizeChange"
            @current-change="handleCaseCurrentChange"
            :current-page.sync="caseCurrentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="caseData.total">
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="onRelatedCase()" size="mini">关联案例</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Vue from 'vue'
// import Component from 'vue-class-component'
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import Card from '@/components/Card'
import NonData from '@/components/NonData'
import CURRENT_ENV_PATH from '../../../services/baseUrl'
import dateFormat from 'element-ui/lib/utils/date'

const moduleOrder = namespace('order')
const moduleUser = namespace('user')

@Component({
  components: { Card, NonData }
})
export default class MyOrder extends Vue {
  ossPath = CURRENT_ENV_PATH.ossPath // 阿里云地址
  isSubmit = false
  loading = true
  caseLoading = true
  isAuth = false // 是否有权限关联案例
  dateFormat = dateFormat // 日期格式化
  dialogVisible = false // 弹窗视图
  searchCaseKey = '' // 搜索案例关键字
  searchOrderKey = '' // 搜索服务单关键字
  currentPage = 1 // 服务单列表当前页面
  currentSize = 10 // 服务单列表当前数目
  tableData = null // 服务单列表数据
  tableDataLoading = false // 服务单列表数据加载中
  caseData = null // 所有的案例
  checkedCasesList = null // 已关联的案例数据
  selcectedCases = [] // 已选择的案例数据
  caseCurrentPage = 1 // 案例列表当前页
  caseCurrentSize = 10 // 案例列表当前数目
  caseCurrentOrderId = '' // 当前查看的服务单id
  @moduleOrder.Action getMyOrderList // 我的服务单接口
  @moduleOrder.Action getCaseList // 我的案例列表接口
  @moduleOrder.Action getOrderCaseList // 已关联的案例列表接口
  @moduleOrder.Action updateOrderCases // 关联案例接口
  @moduleUser.Getter userInfo // 获取用户信息

  openDialog (index, row) {
    console.log(index, row)
    this.caseCurrentOrderId = row.id
    // this.caseCurrentOrderId = '2c908bff656b2d5801656b40127701ca'
    this.dialogVisible = !this.dialogVisible
    // 获取我的案例列表
    this.renderCasesList()
    // 获取已关联的案例列表
    this.renderOrderCasesList({ orderId: this.caseCurrentOrderId })
  }

  handleClose (done) {
    // console.log('关闭')
    this.searchCaseKey = ''
    done()
    // this.$confirm('确认关闭？')
    //   .then(_ => {
    //     done()
    //   })
    //   .catch(_ => {})
  }

  onSearchCases () {
    console.log(this.searchCaseKey)
    this.renderCasesList()
  }

  handleSelectionChange (val) {
    console.log(val)
    this.selcectedCases = val
  }

  isConfirm (val) {
    if (Array.isArray(this.checkedCasesList) && this.checkedCasesList.length) {
      return this.checkedCasesList.some(item => {
        return item.caseId === val.id
      })
    } else {
      return false // 未确认
    }
  }

  onRelatedCase (val, checked) {
    // 关联案例
    // 不是 checked 操作的，也没有选择 checkbox 多选的话，提示选择
    if (!checked && !this.selcectedCases.length) {
      this.$message.warning('请选择要关联的案例')
      return false
    }
    let params = {
      type: 'relation',
      orderCaseList: this.checkedCasesList || []
    }
    if (val) {
      params.orderCaseList.push({
        orderId: this.caseCurrentOrderId,
        caseId: val.id,
        confirm: +this.isConfirm(val)
      })
    } else {
      this.selcectedCases.map(item => {
        params.orderCaseList.push({
          orderId: this.caseCurrentOrderId,
          caseId: item.id,
          confirm: +this.isConfirm(item)
        })
      })
    }
    // console.log(params)
    this.updateOrderCases(params).then(res => {
      // console.log(res)
      if (!val) this.dialogVisible = false
    })
  }

  goUrl (router) {
    this.$router.push(router)
  }

  handleDelete (index, row, isDelete) {
    if (isDelete) {
      // 删除操作
      // this.tableData.records.splice(index, 1)
      this.deleteArticleDetail({ id: row.id }).then(res => {
        this.$message.success('删除成功')
        this.renderTabelData()
      })
    }
    this.tableData.records[index].visibleOfDelete = !this.tableData.records[index].visibleOfDelete
  }

  handleArticleContent (index, row) {
    // console.log(index, row)
    // 跳转页面
    this.$router.push({ name: 'order-detail', query: { orderId: row ? row.id : '' } })
  }

  handleStatus (index, row, isUpdate) {
    if (isUpdate) {
      // 更新状态
      this.orderUpdateStatus({ id: row.id, status: +!row.status }).then(res => {
        if (res.status) {
          this.$message.success(`${row.status ? '上架' : '下架'}成功`)
          this.renderTabelData(this.paramsOfTable)
          // this.tableData.records[index].status = +!this.tableData.records[index].status
        }
      })
    }
    this.tableData.records[index].visibleOfStatus = !this.tableData.records[index].visibleOfStatus
  }

  handleSizeChange (val) {
    console.log(`每页 ${val} 条`)
    this.currentSize = val
    this.renderTabelData()
  }

  handleCaseSizeChange (val) {
    console.log(`案例列表每页${val}条`)
    this.caseCurrentSize = val
  }

  handleCurrentChange (val) {
    console.log(`当前页: ${val}`)
    this.currentPage = val
    this.renderTabelData()
  }

  handleCaseCurrentChange (val) {
    this.caseCurrentPage = val
    this.renderCasesList()
  }

  checkSelectable (row) {
    // 已关联案例里不包含的数据，可关联
    const arr = this.checkedCasesList.reduce((pre, cur) => {
      pre.push(cur.caseId)
      return pre
    }, [])
    console.log(arr, row.id, !arr.includes(row.id))
    return !arr.includes(row.id)
  }

  handleUserAuth () {
    const authType = ['terminalDesigner', 'mtdsknAdmin'] // 只有超管和设计师有关联案例的权限
    // console.log(this.userInfo, JSON.parse(sessionStorage.getItem('userInfo')))
    const roleList = (this.userInfo && this.userInfo.roleList) || JSON.parse(sessionStorage.getItem('userInfo')).roleList || []
    this.isAuth = roleList.some(item => { return authType.includes(item.code) })
    // console.log(this.isAuth)
  }

  searchTableData () {
    this.renderTabelData({
      pageNo: 1
    })
  }

  renderTabelData (params = {}) {
    const postData = Object.assign({
      searchStr: this.searchOrderKey,
      pageNo: this.currentPage || 1,
      pageSize: this.currentSize || 10
    }, params)
    this.loading = true
    this.getMyOrderList(postData).then(res => {
      this.loading = false
      // console.log(res)
      if (res.status) {
        this.tableData = res.data
      }
    })
  }

  renderOrderCasesList (params) {
    this.getOrderCaseList(params).then(res => {
      if (res.status) {
        this.checkedCasesList = res.data
      }
    })
  }

  renderCasesList (params) {
    let data = {
      pageNo: this.caseCurrentPage,
      pageSize: 5,
      sortColumn: 'create_dt',
      SortType: 'desc'
    }
    if (this.searchCaseKey) {
      data.name = this.searchCaseKey
    }
    if (params) {
      data = Object.assign(data, params)
    }
    this.caseLoading = true
    this.getCaseList(data).then(res => {
      this.caseLoading = false
      if (res.status) {
        this.caseData = res.data
        // console.log(res.data)
      }
    })
  }

  created () {
    this.renderTabelData()
    this.handleUserAuth() // 判断有没有权限关联案例
    // console.log(this.userInfo)
  }
}
</script>

<style src="./style.scss" lang="scss" scoped></style>
