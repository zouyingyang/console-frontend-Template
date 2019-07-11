<template>
  <div class="submission">
    <Card>
      <div class="header" slot="head">
        <div class="search-form">
          <el-form :inline="true" :model="form" class="form-inline">
            <el-form-item label="活动名称：" >
              <el-select v-model="form.id" filterable  placeholder="请选择活动名称" style="width:150px;">
                 <el-option
                  v-for="item in activityList"
                  :key="item.value"
                  :label="item.collectionActivityName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提交状态：">
              <el-select v-model="form.status" placeholder="请选择提交状态" style="width:150px;">
                <el-option label="已提交" value="1"></el-option>
                <el-option label="未提交" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商场名称：">
              <el-input v-model="form.orgName" placeholder="商场名称" style="width:150px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="店面名称：">
              <el-input v-model="form.shopName" placeholder="店面名称" style="width:150px;" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getData('search')">查询</el-button>
            </el-form-item>
          </el-form>
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
            label="品牌品类"
            prop="brandAndCategory"
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="促销活动名称"
            prop="collectionActivityName"
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
        </el-table>
      </div>
      <el-pagination
        slot="foot"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize">
      </el-pagination>
    </Card>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Card from '@/components/Card'
import { namespace } from 'vuex-class'

const saleDataModule = namespace('sale-data/index')

@Component({
  components: { Card }
})

export default class Submisson extends Vue {
  loading = false
  currentPage = 1
  totalSize = 0
  form = {
    status: '1',
    id: '',
    orgName: '',
    shopName: ''
  }
  activityList = []
  tableData = []
  collectionActivityName = ''

  @saleDataModule.Action findActivityName
  @saleDataModule.Action findSubmitActivity
  @saleDataModule.Action findNoSubmitActivity

  async mounted () {
    await this.getActivityList()
    await this.getData()
  }
  async getActivityList () {
    await this.findActivityName().then((res) => {
      console.log(res)
      if (res.code === '200') {
        this.activityList = res.data.length ? res.data : []
        if (!this.form.id) {
          this.form.id = this.activityList[0].id
        }
      }
    })
  }
  async getData (type) {
    if (type === 'search') {
      this.currentPage = 1
    }
    this.loading = true
    const activityId = this.form.id
    let fillingType = null
    this.activityList.forEach(item => {
      if (item.id === activityId) {
        fillingType = item.fillingType
        this.collectionActivityName = item.collectionActivityName
      }
    })
    // 获取已提交门店列表
    if (this.form.status === '1') {
      await this.findSubmitActivity({
        collectionActivityName: this.collectionActivityName,
        fillingType: fillingType,
        id: activityId,
        orgName: this.form.orgName,
        shopName: this.form.shopName,
        pageNum: this.currentPage,
        pageSize: 10
      }).then((res) => {
        console.log(res)
        if (res.code === '200') {
          this.tableData = res.data.list
          this.totalSize = res.data.total
        }
        this.loading = false
      }).catch((err) => {
        console.log('err:', err)
      })
    }

    // 获取未提交门店列表
    if (this.form.status === '0') {
      await this.findNoSubmitActivity({
        collectionActivityName: this.collectionActivityName,
        fillingType: fillingType,
        id: activityId,
        orgName: this.form.orgName,
        shopName: this.form.shopName,
        pageNum: this.currentPage,
        pageSize: 10
      }).then((res) => {
        console.log(res)
        if (res.code === '200') {
          this.tableData = res.data.list
          this.totalSize = res.data.total
        }
        this.loading = false
      }).catch((err) => {
        console.log('err:', err)
      })
    }
  }
  // 处理翻页
  handleCurrentChange (val) {
    this.currentPage = val
    this.getData()
  }
}

</script>

<style src="./style.scss" lang="scss" scoped></style>
