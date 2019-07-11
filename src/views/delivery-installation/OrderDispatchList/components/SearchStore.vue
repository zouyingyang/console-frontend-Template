<template>
    <div>
      <div class="op-right" style="height: 3em;">
        <el-input v-if="getstoreByid" style="width: 72%; margin-right: 5px" v-model="params.searchKeyword"
                  @keyup.enter.native="ShowStandard"
                  maxlength="50"
                  size="mini" placeholder="门店名称、门店编号"></el-input>
        <el-input v-else style="width: 72%; margin-right: 5px" v-model="params.searchKeyword"
                  @keyup.enter.native="ShowStandard"
                  maxlength="50"
                  size="mini" placeholder="商场名称、商场编号"></el-input>
        <el-button @click="ShowStandard" size="mini" type="primary">搜索</el-button>
      </div>
      <div style="overflow: hidden;margin-bottom: 20px;width: 100%;">
        <div style="float: left;">
          <el-button  @click="checkAll" size="mini" type="primary">全选</el-button>
          <el-button  @click="clearAll" size="mini" type="primary">清空</el-button>
        </div>
        <div style="float: right;margin-right: 5px">
          <el-button  @click="sumbitCheck" size="mini" type="primary">确认</el-button>
        </div>
      </div>
    <template>
      <el-table
        v-loading="loading"
        size="mini"
        :data="tableData"
        ref="table"
        style="width: 100%;"
        :max-height="fullHeight"
        border>
        <div v-for="(list,index) in tableHead" :key="index">
          <template v-if="list.name==='操作'">
            <el-table-column align="center" :prop="list.value" :label="list.name" width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.choose" label="" name="type" @change="checkedChange(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column align="center" :prop="list.value" :label="list.name"></el-table-column>
          </template>
        </div>

      </el-table>
    </template>

    <!-- 分页 -->
    <el-pagination
      class="busPagin"
      @current-change="changeCurrentPage"
      @size-change="handleSizeChange"
      :current-page="params.pageNum"
      :page-size="params.pageSize"
      :page-sizes="[20,50,100]"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
/*
             isShow
             type：Boolean
             说明：当前模块是否需要初始化

             checkMaketArr
             type：Array
             说明：传入选择的商场

             getstoreByid：
             type：Boolean
             说明：是否为查询门店

             组件返回值：
             选择门店或者商场时，把选择数据一整行返回父节点
          */
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const relevanceMarketModule = namespace('delivery-installation/relevanceMarket')
const moduleOrderDispatchList = namespace('delivery-installation/orderDispatchList')
const moduleUser = namespace('user')

  @Component({
    components: {}
  })
export default class SearchStore extends Vue {
    @Prop({ type: Boolean, default: false }) isShow
    @Prop({ type: Array, default: [] }) checkMaketArr // 传入选择的商场数组
    @Prop({ type: Array, default: [] }) checkStoreArr // 传入选择的门店数组
    @Prop({ type: Boolean, default: false }) getstoreByid // 是否是查询门店
    loading = false
    // 标准品总和
    total = 0
    params = {
      pageNum: 1,
      pageSize: 20,
      searchKeyword: '',
      flag: 'currentUser'
    }
    tableHead = []
    maketHead = [
      {
        name: '商场编号',
        value: 'mainMarketCode'
      }, {
        name: '操作',
        value: ''
      }, {
        name: '商场名称',
        value: 'mainMarketName'
      }
    ]
    storeHead = [
      {
        name: '门店编号',
        value: 'shopCode'
      }, {
        name: '操作',
        value: ''
      }, {
        name: '门店名称',
        value: 'shopName'
      }
    ]
    tableData = []

    // 查询商场
    @relevanceMarketModule.Action listMainMarket
    // 根据商场id查询商店
    @moduleOrderDispatchList.Action getShopByOrgId
    // 用户信息
    @moduleUser.Getter userInfo

    // 初始化数据
    initData () {
      this.loading = true
      this.tableData = []
      // console.log({ ...this.params })
      if (!this.getstoreByid) {
        this.getMaket()
      } else {
        this.getStore()
      }
    }
    // 获取商场
    getMaket () {
      if (this.userInfo.roleList && this.userInfo.roleList.length) {
        this.userInfo.roleList.forEach(list => {
          if (list.name === 'MTDS2超级管理员') {
            this.params.flag = ''
          }
        })
      }
      this.listMainMarket({ ...this.params }).then(res => {
        this.loading = false
        res = JSON.parse(JSON.stringify(res))
        if (res.status && res.code === '200') {
          console.log('查询商场', res)
          this.tableHead = this.maketHead
          this.tableData = res.data.list
          this.refreshTable()
          this.total = res.data.total
        }
      }).catch((error) => {
        this.loading = false
        this.total = 0
        console.log('查询商场error', error)
      })
    }
    // 获取门店
    getStore () {
      let params = JSON.parse(JSON.stringify(this.params))
      let ids = []
      this.checkMaketArr.forEach((e, i) => {
        ids.push(e.id)
      })
      params.ids = ids.length === 1 ? ids[0] : ids.join(',')
      // console.log('params', JSON.stringify(params))
      this.getShopByOrgId({ ...params }).then(res => {
        this.loading = false
        res = JSON.parse(JSON.stringify(res))
        if (res.status && res.code === '200') {
          console.log('查询门店', res)
          this.tableHead = this.storeHead
          this.tableData = res.data.list
          this.refreshTable()
          this.total = res.data.total
        }
      }).catch((error) => {
        this.loading = false
        this.total = 0
        console.log('查询门店error', error)
      })
    }
    // 点击勾选时
    checkedChange (row) {
      // console.log('this.row',JSON.parse(JSON.stringify(row)))
      if (!this.getstoreByid) {
        if (row.choose) { // 如果当前勾选为true
          if (this.tableData.length) {
            this.tableData.forEach((e, i) => {
              if (e.id === row.id) {
                this.tableData[i].choose = true
              }
            })
          }
        } else {
          this.tableData.forEach((e, i) => {
            if (e.id === row.id) {
              this.tableData[i].choose = false
            }
          })
        }
      } else {
        if (row.choose) { // 如果当前勾选为true
          if (this.tableData.length) {
            this.tableData.forEach((e, i) => {
              if (e.shopId === row.shopId) {
                this.tableData[i].choose = true
              }
            })
          }
        } else {
          this.tableData.forEach((e, i) => {
            if (e.shopId === row.shopId) {
              this.tableData[i].choose = false
            }
          })
        }
      }
    }
    clearAll () {
      this.tableData.forEach((e, i) => {
        this.tableData[i].choose = false
      })
    }

    checkAll () {
      this.tableData.forEach((e, i) => {
        this.tableData[i].choose = true
      })
    }
    refreshTable () {
      let tableData = []
      if (this.tableData) {
        this.tableData.forEach((e, i) => {
          tableData.push({ ...e, choose: false })
        })
        this.tableData = tableData
        if (this.checkMaketArr.length && !this.getstoreByid) {
          this.tableData.forEach((item, index) => {
            this.checkMaketArr.forEach((e, i) => {
              if (item.id === e.id) {
                this.tableData[index].choose = true
              }
            })
          })
        } else if (this.checkStoreArr.length && this.getstoreByid) {
          this.tableData.forEach((item, index) => {
            this.checkStoreArr.forEach((e, i) => {
              if (item.shopId === e.shopId) {
                this.tableData[index].choose = true
              }
            })
          })
        }
      }
      // console.log(JSON.parse(JSON.stringify(this.tableData)))
    }

    // // 选择商场
    sumbitCheck () {
      let arr = []
      if (this.tableData) {
        this.tableData.forEach((e, i) => {
          if (e.choose) {
            arr.push(e)
          }
        })
      }
      this.$emit('chooseStore', arr)
    }

    // 换页控制
    changeCurrentPage (val) {
      this.params.pageNum = val
      this.initData()
    }

    // 一页展示多少条数据
    handleSizeChange (size) {
      this.params.pageSize = size
      this.initData()
    }

    // 提交搜索内容
    ShowStandard () {
      this.initData()
    }

    // 获取屏幕高度
    get fullHeight () {
      return document.documentElement.clientHeight * 0.45
    }

    @Watch('isShow')
    isShowChange (isShow) {
      if (isShow) {
        this.initData()
      }
    }

    @Watch('getstoreByid')
    getstoreByidChange (getstoreByid) {
      this.params.searchKeyword = ''
    }
    @Watch('checkMaketArr')
    checkMaketArrChange (checkMaketArr) {
    }

    created () {
      this.initData()
    }
  }
</script>

<style scoped lang="scss">
  .product {
    width: 100%;
    overflow: hidden;
    text-align: center;
    margin-bottom: 0.8em;
    line-height: 2em;
    span {
      margin-left: 5px;
      display: block;
      text-align: left;
      float: left;
    }
    .leftSpan {
      width: 15em;
    }
    .el-input__inner {
      float: left;
      width: 6em;
      height: 2em;
    }
  }
</style>
