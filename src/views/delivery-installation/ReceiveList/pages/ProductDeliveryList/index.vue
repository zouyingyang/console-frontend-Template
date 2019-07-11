<template>
  <div>
    <Card v-loading="loading">
      <div class="table-feature-block" slot="head">
        <div class="table-feature-block__header">
          <div class="handle-wrap">
            <div class="input-form">
              <span class="input-form__left">批量维护库位</span>
              <el-autocomplete
                class="input-form__right"
                v-model="stockPosition"
                :fetch-suggestions="querySearch"
                :max-height="50">
              </el-autocomplete>
            </div>
            <el-button type="primary" @click="onSign()">批量签收</el-button>
          </div>
          <div class="search-wrap">
            <el-form :inline="true">
              <el-form-item label="">
                <el-input  v-model="searchKey" clearable placeholder="工厂合同自编号、二级品类"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button v-show="!isSeniorSearch" type="primary" @click="onSearch">搜索</el-button>
                <el-button type="primary" @click="onIsSeniorSearch">{{ isSeniorSearch ? '收起' : '展开'}}高级搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div v-show="isSeniorSearch" class="table-feature-block__content">
          <el-form :inline="true" :model="seniorSearchForm" ref="seniorSearchForm">
            <el-form-item label="实际收货日期" prop="receiveTime">
              <el-date-picker
                value-format="timestamp"
                v-model="seniorSearchForm.receiveTime"
                style="width: 310px;"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <el-select v-model="seniorSearchForm.brand" placeholder="请选择品牌">
                <el-option v-for="option in options.brand" v-bind:key="option.value" :label="option.label" :value="option.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品类" prop="category">
              <el-select v-model="seniorSearchForm.category" placeholder="请选择品类">
                <el-option v-for="option in options.category" v-bind:key="option.value" :label="option.label" :value="option.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="seniorSearchForm.status" placeholder="请选择状态">
                <el-option v-for="option in options.status" v-bind:key="option.value" :label="option.label" :value="option.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="收货人" prop="takeBy">
              <el-input v-model="seniorSearchForm.takeBy" clearable placeholder="收货人"></el-input>
            </el-form-item> -->
            <el-form-item label="收货人" prop="takeBy" class="takeBy-wrap">
              <el-tag style="margin-right: 5px" v-if="!seniorSearchForm.takeBy.length" class="checkTag" size="mini">暂未选择收货人</el-tag>
              <el-tag v-else closable @close="closeTag"  style="margin-right: 5px" v-for="(item,index) in seniorSearchForm.takeBy" :key="index" size="mini">{{item.name}}</el-tag>
              <el-button @click="takeBySearch" type="text">选择</el-button>
            </el-form-item>
            <!-- <el-form-item label="存放库位" prop="stockPosition">
              <el-input v-model="seniorSearchForm.stockPosition" clearable placeholder="存放库位"></el-input>
            </el-form-item> -->
            <el-form-item class="float-right">
              <el-button type="primary" @click="onSearch">搜索</el-button>
              <el-button @click="resetForm('seniorSearchForm')">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="content" v-if="deliveryListData">
        <el-table
          :data="deliveryListData.list"
          border
          ref="deliveryListData"
          @select="handleSelect"
          @selection-change="handleSelectionChange"
          @select-all="handleAllSelect"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
            <!-- :selectable="handleIsSelectable" -->
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="onSign([scope.row])">签收</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="factoryContractNo"
            label="工厂合同自编号"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="品牌"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="categoryName"
            label="品类"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="clsleve2Name"
            label="二级品类"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            label="存放库位"
            align="center"
            width="180">
            <template slot-scope="scope">
              <el-autocomplete
                size="mini"
                v-model="scope.row.clsleve2StockPosition"
                :fetch-suggestions="querySearch"
                :max-height="50"
                placeholder="请输入存放库位"
                @select="modifyTheLibraryBit(scope.row)"
                @blur="modifyTheLibraryBit(scope.row)"></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column
            label="订单数量"
            align="center">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                width="400"
                trigger="click">
                <el-table
                  :data="scope.row.list"
                  border
                  style="width: 100%">
                  <el-table-column label="选择" width="55">
                    <template slot-scope="cls">
                      <el-checkbox
                        label=""
                        name="type"
                        :disabled="cls.row.status!=='10'"
                        @change="handleCheckClsleve3(scope.row)"
                        v-model="cls.row.checked">
                      </el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column property="clsleve3Name" label="三级品类"></el-table-column>
                  <!-- <el-table-column width="50" property="checked" label="是"></el-table-column> -->
                  <el-table-column width="90" property="clsleve3Code" label="包条码"></el-table-column>
                  <el-table-column width="75" property="statusName" label="状态"></el-table-column>
                </el-table>
                <el-button slot="reference" type="text">{{ scope.row.quanlity }}</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="receiveQuantity"
            label="收货数量"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="statusName"
            label="状态"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            label="实际收货时间"
            align="center">
            <template slot-scope="scope">{{ format(scope.row.creatTime) }}</template>
          </el-table-column>
          <el-table-column
            prop="createBy"
            label="收货人"
            align="center"
            width="180">
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
            :total="deliveryListData.total">
          </el-pagination>
        </div>
      </div>
    </Card>
    <!--收货人选择弹窗-->
    <el-dialog
      class="deliveryAndSetter"
      :title="choose?'':'收货人选择'"
      :visible.sync="isShowDeliveryMan"
      width="52%"
      height="45%"
      :close-on-click-modal="false"
      center
      append-to-body>
      <DeliveryAndSetter :type="null" :choose="choose"
                         :paramsData="{source: 'new'}"
                         @choseDeliveryInstallStaff="onClose"
                         :multipleValues="[]"
                         :changeState="isShowDeliveryMan"></DeliveryAndSetter>
    </el-dialog>
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Card from '@/components/Card'
import DeliveryAndSetter from '@/views/delivery-installation/DeliveryInstallationList/components/DeliveryAndSetter'
import { format } from '@/utils/filter'
import storage from '@/utils/storage'
const receiveListPort = namespace('delivery-installation/receiveListPort')
  @Component({
    components: { Card, DeliveryAndSetter }
  })
export default class ProductDeliveryList extends Vue {
    loading = false
    searchKey = ''
    stockPosition = '' // 批量维护库位
    isSeniorSearch = false // 是否展开高级搜索
    seniorSearchForm = {
      receiveTime: '', // 实际收货时间
      brand: '',
      category: '',
      status: '',
      takeBy: []
      // stockPosition: ''
    }
    choose = false
    isShowDeliveryMan = false // 收货人弹窗
    deliveryListData = null
    deliveryListSelection = []
    currentPage = 1
    currentSize = 10
    options = {
      brand: [
        // { value: '', label: '全部' },
        { value: 'brand_oppein', label: '欧派' },
        { value: 'brand_oboli', label: '欧铂丽' },
        { value: 'brand_oboni', label: '欧铂尼' }
      ],
      category: [
        // { value: '', label: '全部' },
        { value: 'category_chugui', label: '橱柜' },
        { value: 'category_yigui', label: '集成家居' },
        { value: 'category_mumen', label: '木门' },
        { value: 'category_weiyu', label: '卫浴' },
        { value: 'category_qiangshi', label: '软装' },
        { value: 'category_jinshumenchuang', label: '金属门窗' }
      ],
      // 订单状态
      status: [
        // { value: '', label: '全部' },
        // { value: '1', label: '已返货' },
        { value: '10', label: '待收货' },
        { value: '20', label: '部分收货' },
        { value: '30', label: '已收货' }
      ]
    }
    @receiveListPort.Action deliveryStandardList
    @receiveListPort.Action updateStockPosition
    @receiveListPort.Action signingByStandard

    // 表格数据读取
    renderTabelData (params = {}) {
      this.loading = true
      const pageData = {
        pageNum: this.currentPage,
        pageSize: this.currentSize
      }
      let postData = {}
      // const postData = this.isSeniorSearch ? this.seniorSearchForm : { searchKeyword: this.searchKey }
      if (this.isSeniorSearch) {
        postData.receiveTimeBg = this.seniorSearchForm.receiveTime[0]
        postData.receiveTimeEd = this.seniorSearchForm.receiveTime[1]
        postData.brand = this.seniorSearchForm.brand
        postData.category = this.seniorSearchForm.category
        postData.status = this.seniorSearchForm.status
        postData.takeBy = this.seniorSearchForm.takeBy.length ? this.seniorSearchForm.takeBy[0].id : ''
        postData.searchKeyword = this.searchKey
        // postData.stockPosition = this.seniorSearchForm.stockPosition
      } else {
        postData.searchKeyword = this.searchKey
      }
      this.deliveryStandardList(Object.assign(postData, pageData, params)).then(res => {
        this.loading = false
        res = JSON.parse(JSON.stringify(res))
        console.log('获取订单签收列表res', res)
        if (res.status && res.code === '200') {
          res.data.list = res.data.list.reduce((prev, cur) => {
            cur.clsleve2StockPosition = cur.stockPosition
            cur.list.map(item => {
              item.checked = false
            }) // 主要是给每条三级品类加上 checked 属性
            prev.push(cur)
            return prev
          }, [])
          this.deliveryListData = res.data
        }
      }).catch(error => {
        console.log('获取订单签收列表error', error)
      })
    }

    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.currentSize = val
      this.renderTabelData(this.paramsOfTable)
    }

    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.renderTabelData(this.paramsOfTable)
    }

    // 页面搜索缓存库位
    querySearch (queryString, cb) {
      let restaurants = this.storeListArr
      let results = queryString ? restaurants.filter(item => { return item.value.includes(queryString) }) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    }

    // 收货人选择
    takeBySearch () {
      this.type = null
      this.isShowDeliveryMan = true
    }
    // 选择收货人关闭
    onClose (data) {
      this.seniorSearchForm.takeBy = []
      this.seniorSearchForm.takeBy.push(data)
      this.isShowDeliveryMan = false
    }
    // 收货人移除
    closeTag (data) {
      // console.log(data)
      if (data.isTrusted) {
        this.seniorSearchForm.takeBy = []
      }
    }

    // 修改库位
    modifyTheLibraryBit (row) {
      //  || (!row.clsleve2StockPosition && row.stockPosition)
      if ((row.stockPosition === row.clsleve2StockPosition) || (!row.clsleve2StockPosition && !row.stockPosition)) {
        return
      }
      this.loading = true
      this.updateStockPosition({
        id: row.id,
        stockPosition: row.clsleve2StockPosition || ''
      }).then(res => {
        this.loading = false
        // console.log('修改库位res', res)
        if (res.status && res.code === '200') {
          this.$message.success('修改库位成功')
          this.renderTabelData()
        }
      }).catch(error => {
        this.loading = false
        console.log('修改库位error', error)
      })
    }

    onSign (val) { // 签收功能
      let signData = val || this.deliveryListSelection
      console.log(signData)
      let orderNum = 0 // 订单数量
      let receiveNum = 0 // 收货数量
      let postParams = [] // 要提交的数据
      signData.map(item => {
        let postData = {
          id: item.id,
          stockPosition: this.stockPosition || item.clsleve2StockPosition || item.stockPosition, // this.stockPosition是批量修改库位， item.clsleve2StockPosition是单个修改,item.stockPosition是它本来的库位
          leve3: []
        }
        orderNum += +item.quanlity // 统计订单数量
        item.list.map(cls => {
          receiveNum += +cls.checked // 统计收货数量
          postData.leve3.push({
            barCode: cls.barCode,
            caseFlag: cls.caseFlag,
            checked: +cls.checked || +(cls.status >= '30'), // 已签收
            clsleve3Code: cls.clsleve3Code,
            clsleve3Name: cls.clsleve3Name,
            id: cls.id,
            packageNo: cls.packageNo
          })
        })
        postParams.push(postData)
      })
      if (!receiveNum) {
        this.$message.info('未选择签收订单')
        return false
      }
      console.log(signData, orderNum, receiveNum)
      this.$confirm(`您所选择的记录订单下单${orderNum}件，确认收货${receiveNum}件`, '确认收货', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.signingByStandard({ data: [{ orders: [{ leve2: postParams }] }] }).then(res => {
          console.log(res)
          if (res.status) {
            this.$message.success('签收成功')
            this.renderTabelData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消签收'
        })
      })
    }

    handleIsSelectable (row, index) {
      return +row.receiveCompleted !== +row.sendCompleted
    }

    handleSelectionChange (val) {
      this.deliveryListSelection = val
    }

    handleAllSelect (val) {
      // 全选时
      this.deliveryListData.list.map(selection => {
        selection.list.map(cls => {
          cls.checked = !!val.length && (cls.status === '10') // val.length 有值代表全选且状态为10待收货，为 0 代表全取消
        })
      })
      this.deliveryListSelection = this.deliveryListData.list
    }

    handleSelect (val, row) { // 订单的选中操作 val 相当于 deliveryListSelection， row 当前点击的行
      this.deliveryListSelection = val
      const isAdd = val.filter(item => { return item.id === row.id }).length
      this.deliveryListData.list.map(item => {
        if (item.id === row.id) {
          item.list.map(cls => {
            cls.checked = !!isAdd && (cls.status === '10') // 如果是选中该条，所有订单就要被选中,反之亦然
          })
        }
      })
    }

    handleCheckClsleve3 (order) { // 选择或取消三级品类
      const isSelected = order.list.some(list => { return list.checked === true })
      this.$refs.deliveryListData.toggleRowSelection(order, isSelected)
    }

    onIsSeniorSearch () {
      this.isSeniorSearch = !this.isSeniorSearch
    }

    resetForm (name) {
      console.log(this.$refs)
      this.$refs.seniorSearchForm.resetFields()
      // this.checkData()
      // console.log(this.selectValue)
    }

    onSearch () {
      this.currentPage = 1 // 每次点搜索默认从第一页开始
      this.renderTabelData()
    }

    format (timestamp) {
      return format(timestamp, 'yyyy-M-d HH:mm:s')
    }

    mounted () {
      this.renderTabelData({ status: '10' }) // 默认加载状态为待收货列表
    }

    get storeListArr () {
      let ListArr = []
      let arr = JSON.parse(storage.getItem('userStoreList')) || []
      if (arr.length) {
        arr.forEach((item) => {
          let obj = {}
          obj.value = item.store
          ListArr.push(obj)
        })
      }
      return ListArr
    }
  }
</script>
<style src="./style.scss" lang="scss"></style>
