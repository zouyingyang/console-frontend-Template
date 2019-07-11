<template>
    <div>
      <div style="overflow: hidden;margin-bottom: 20px;width: 100%;">
        <div style="float: right;margin-right: 5px">
          <el-button  @click="sumbitCheck" size="mini" type="primary">确认</el-button>
        </div>
        <div class="op-right" style="height: 3em; margin-right: 5px">
          <el-input style="width: 72%; margin-right: 5px" v-model="params.searchKeyWord"
                    @keyup.enter.native="sumbitSearch"
                    maxlength="50"
                    size="mini" placeholder="商场名称"></el-input>
          <el-button @click="sumbitSearch" size="mini" type="primary">搜索</el-button>
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
                <el-checkbox v-model="scope.row.check" label="" name="type" @change="checkedChange(scope.row)"></el-checkbox>
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
      :page-sizes="[20]"
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

             组件返回值：
             选择门店或者商场时，把选择数据一整行返回父节点
          */
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const coefficientModule = namespace('settlement-coefficient/index')

  @Component({
    components: {}
  })
export default class SearchStore extends Vue {
    @Prop({ type: Boolean, default: false }) isShow
    @Prop({ type: Array, default: [] }) checkMaketArr // 传入选择的商场数组
    @Prop({ type: Object, default: {} }) item // 传入选择的商场数组
    loading = false
    total = 0
    selfCheckArr = []
    showArr = []
    params ={
      brand: '',
      category: '',
      pageNum: 1,
      pageSize: 20,
      searchKeyWord: ''
    }

    tableHead = [
      {
        name: '商场编号',
        value: 'no'
      }, {
        name: '操作',
        value: ''
      }, {
        name: '商场名称',
        value: 'name'
      }
    ]
    tableData = []

    // 查询商场
    @coefficientModule.Action getMarketByBrandCategory

    // 初始化数据
    initData () {
      this.tableData = []
      this.params.pageSize = 20
      this.loading = true
      this.params.searchKeyWord = this.params.searchKeyWord.replace(/\s+/g, '')
      if (this.params.searchKeyWord) {
        this.getMarketByBrandCategory(this.params).then(res => {
          if (res.status && res.code === '200') {
            if (res.data.list.length) {
              res.data.list.forEach((item) => {
                item.check = false
                if (this.selfCheckArr.length) {
                  this.selfCheckArr.forEach((self) => {
                    if (self.id === item.id) {
                      item.check = true
                    }
                  })
                }
                this.tableData.push({ ...item })
              })
            }

            this.total = res.data.total
            console.log('获取商场', res)
            this.loading = false
          }
        }).catch(error => {
          this.loading = false
          console.log('获取商场error', error)
          this.$message.warning('获取商场error')
        })
      } else {
        this.loading = false
        this.$message.warning('您输入为空~')
      }
    }

    showCheck () {
      this.tableData = this.showArr
      this.params.pageNum = 1
      this.params.pageSize = this.showArr.length
      this.total = this.showArr.length
    }
    // 点击勾选时
    checkedChange (row) {
      if (row.check) {
        this.selfCheckArr.push(row)
      } else {
        this.selfCheckArr.forEach((item, index) => {
          if (item.id === row.id) {
            this.selfCheckArr.splice(index, 1)
          }
        })
      }
    }

    // 确认按钮
    sumbitCheck () {
      this.params.searchKeyWord = ''
      this.showArr = JSON.parse(JSON.stringify(this.selfCheckArr))
      this.showCheck()
      this.$emit('sumbitStore', JSON.parse(JSON.stringify(this.selfCheckArr)))
    }

    // 换页控制
    changeCurrentPage (val) {
      this.params.pageNum = val
      this.initData()
    }

    // 一页展示多少条数据
    handleSizeChange (size) {
      this.params.pageSize = size
      // this.initData()
    }

    // 提交搜索内容
    sumbitSearch () {
      this.initData()
    }

    // 获取屏幕高度
    get fullHeight () {
      return document.documentElement.clientHeight * 0.45
    }

    @Watch('isShow')
    isShowChange (isShow) {
      if (isShow) {
        this.params.searchKeyWord = ''
        this.selfCheckArr = JSON.parse(JSON.stringify(this.checkMaketArr))
        this.showArr = JSON.parse(JSON.stringify(this.checkMaketArr))
        this.showCheck()
      }
    }

    @Watch('checkMaketArr')
    checkMaketArrChange (checkMaketArr) {
      this.selfCheckArr = JSON.parse(JSON.stringify(checkMaketArr))
    }

    created () {
      this.selfCheckArr = JSON.parse(JSON.stringify(this.checkMaketArr))
      this.showArr = JSON.parse(JSON.stringify(this.checkMaketArr))
      this.params.brand = this.item.brand
      this.params.category = this.item.category
      this.showCheck()
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
