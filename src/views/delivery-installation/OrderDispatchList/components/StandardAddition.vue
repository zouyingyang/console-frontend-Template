<template>
  <div>
    <div>
      <div style="overflow: hidden;margin-bottom: 20px">
        <div style="float: left;">
          <el-button @click="ShowStandard" size="mini" type="primary">加入送货安装单</el-button>
        </div>
        <div style="float: right;">
          <el-input style="width: 72%; margin-right: 5px" v-model="params.searchKeyword"
                    @keyup.enter.native="submitSearch"
                    maxlength="50"
                    clearable
                    size="mini" placeholder="产品编号、产品名称"></el-input>
          <el-button @click="submitSearch" size="mini" type="primary">搜索</el-button>
        </div>
      </div>
    </div>
    <template>
      <el-table
        v-loading="loading"
        size="mini"
        :data="tableData"
        style="width: 100%;"
        :max-height="fullHeight"
        border
      >
        <div v-for="(list,index) in tableHead" :key="index">
          <template v-if="list.name==='操作'">
            <el-table-column fixed :label="list.name" align="center" width="100">
              <template slot-scope="scope">
                <el-checkbox @change="checkedChange(scope.row)" v-model="scope.row.two"></el-checkbox>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="list.name==='产品名称'">
            <el-table-column :label="list.name" align="center" width="200">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row[list.value]" placement="top">
                  <p class="op-nowrap op-pointer">{{scope.row[list.value]}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="list.name==='品牌'">
            <el-table-column :label="list.name" align="center">
              <template slot-scope="props">
                {{props.row[list.value] | brandFilter}}
              </template>
            </el-table-column>
          </template>
          <template v-else-if="list.name==='品类'">
            <el-table-column :label="list.name" align="center">
              <template slot-scope="props">
                {{props.row[list.value] | categoryFilter}}
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
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>

    <!--标准品数量输入-->
    <el-dialog
      v-loading="standardLoading"
      title="标准品数量确认"
      :visible.sync="isShowStandard"
      width="30%"
      append-to-body
      :close-on-click-modal="false"
      center>
      <div class="product" :key="index" v-for="(item,index) in checkedProduct">
        <span class="leftSpan">编号{{item.productCode}}的电器出库共</span>
        <input @change="numChange(item.quanlity,index)" class="el-input__inner" type="number" v-model="item.quanlity">
        <span>{{item.productUnit}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowStandard = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitMenu" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { brandFilter, categoryFilter } from '@/utils/filter'

const orderDispatchList = namespace('delivery-installation/orderDispatchList')

  @Component({
    filters: { brandFilter, categoryFilter },
    components: {}
  })
export default class StandardAddition extends Vue {
    @Prop({ type: Boolean, default: false }) isShow
    @Prop({ type: String, default: '' }) StandardAdditionId
    loading = false
    standardLoading = false // 标准品数量弹窗loading
    isShowStandard = false // 标准品数量弹窗
    checkedProduct = []// 已选标准品数组
    // 标准品总和
    total = 0
    params = {
      pageNum: 1,
      pageSize: 10,
      searchKeyWord: ''
    }
    tableHead = [
      { name: '操作', value: '' },
      { name: '产品型号', value: 'productCode' },
      { name: '产品名称', value: 'productName' },
      { name: '品牌', value: 'brand' },
      { name: '品类', value: 'category' },
      { name: '一级目录', value: 'level1Dir' },
      { name: '二级目录', value: 'level2Dir' },
      { name: '三级目录', value: 'level3Dir' },
      { name: '四级目录', value: 'level4Dir' },
      { name: '规格', value: 'size' },
      { name: '单位', value: 'productUnit' }
    ]
    tableData = []

    // 查询标准品
    @orderDispatchList.Action productList
    // 查询标准品dev1.1新增
    @orderDispatchList.Action salesDeliveryProductList

    // 初始化数据
    initData () {
      this.loading = true
      this.tableData = []
      // console.log({ ...this.params })
      this.salesDeliveryProductList({ ...this.params }).then(res => {
        this.loading = false
        res = JSON.parse(JSON.stringify(res))
        if (res.status && res.code === '200') {
          if (res.data && !!res.data.list) {
            // 添加标准品勾选状态
            res.data.list.forEach((item, index) => {
              res.data.list[index].two = false
              res.data.list[index].leve3 = [{ lsleve2Id: '' }]
              res.data.list[index].categoryType = 1
              res.data.list[index].quanlity = 1
            })
            if (this.checkedProduct.length) { // 多页显示时，已选标准品在页面呈现勾选状态
              this.checkedProduct.forEach((item, index) => {
                res.data.list.forEach((e, i) => {
                  if (item.id === e.id) {
                    res.data.list[i].two = true
                  }
                })
              })
            }
            this.tableData = res.data.list
            this.total = res.data.total
            // console.log('标准品this.tableData', this.tableData)
          }
        }
      }).catch((error) => {
        this.total = 0
        console.log('获取标准品error', error)
      })
    }
    ShowStandard () {
      if (this.checkedProduct.length) {
        this.isShowStandard = true
      } else {
        this.$message.warning('您没有勾选标准品~')
      }
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
    submitSearch () {
      this.initData()
    }
    // 标准品数量变化
    numChange (num, index) {
      if (num <= 0) {
        this.checkedProduct[index].quanlity = 1
      }
    }

    // 点击标准品勾选
    checkedChange (item) {
      if (item.two) { // 如果当前勾选为true
        if (this.checkedProduct.length) {
          this.checkedProduct.forEach((e, i) => {
            if (e.id === item.id) {
              this.checkedProduct.splice(i, 1)
            }
          })
        }
        this.checkedProduct.push(item)
      } else {
        this.checkedProduct.forEach((e, i) => {
          if (e.id === item.id) {
            this.checkedProduct.splice(i, 1)
          }
        })
      }
    }

    // 标准品加入送货安装单
    submitMenu () {
      if (this.checkedProduct.length) {
        console.log('标准品加入送货安装单', JSON.parse(JSON.stringify(this.checkedProduct)))
        this.$emit('submitMenu', this.checkedProduct)
        this.isShowStandard = false
      } else {
        this.$message.warning('您没有勾选标准品~')
      }
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
    @Watch('StandardAdditionId')
    StandardAdditionIdChange (StandardAdditionId) {
      this.checkedProduct = []
    }
    created () {
      this.initData()
    }
  }
</script>

<style scoped lang="scss">
.product{
  width: 100%;
  overflow: hidden;
  text-align: center;
  margin-bottom: 0.8em;
  line-height: 2em;
  span{
    margin-left: 5px;
    display: block;
    text-align: left;
    float: left;
  }
  .leftSpan{
    width:15em;
  }
  .el-input__inner{
    float: left;
    width:6em;
    height: 2em;
  }
}
</style>
