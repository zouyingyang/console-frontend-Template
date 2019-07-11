<template>
  <div>
    <div class="coefficientMaintenance" v-show="!$route.meta.hidden">
      <Card v-loading="loading">
        <div class="header" slot="head">
          <div class="header-toolbar">
            <div>
              <el-button type="primary" size="mini" @click="addCoefficient">新增结算系数</el-button>
              <el-button type="primary" size="mini" @click="deleteSome">一键删除</el-button>
            </div>
            <div class="search-form">
              <el-input
                maxlength="20"
                size="mini"
                placeholder="搜索结算系数名称"
                v-model="searchKeyword"
                clearable
                @clear="initData()"
                @keyup.enter.native="initData()"
                class="searchInput"
              >
              </el-input>
              <el-button type="primary" size="mini" @click="initData()">搜索</el-button>
            </div>
          </div>
        </div>
        <div slot="content">
          <el-table
            :max-height="tableHeight"
            :data="tableData"
            :tableHead="tableHead"
            border
            style="width: 100%">
            <div v-for="(list,index) in tableHead" :key="index">
              <template v-if="list.name ==='操作'">
                <el-table-column
                  fixed="right"
                  align="center"
                  min-width="130"
                  :label="list.name">
                  <template slot-scope="scope">
                    <el-button @click="toCheck(scope.row)" type="text">查看</el-button>
                    <el-button @click="toCompile(scope.row)" type="text">编辑</el-button>
                    <el-button @click="deleteShow(scope.row)" type="text">删除</el-button>
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="list.name ==='选择'">
                <el-table-column
                  align="center"
                  min-width="50"
                  :label="list.name">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.check"></el-checkbox>
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="list.name ==='传单结算系数'">
                <el-table-column :label="list.name" align="center" min-width="110">
                <template slot-scope="props">
                  {{props.row[list.value]}}
                </template>
              </el-table-column>
              </template>
              <template v-else-if="list.name ==='结算系数规则名称'">
                <el-table-column :label="list.name" align="center" min-width="220">
                  <template slot-scope="props">
                    {{props.row[list.value]}}
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="list.name ==='最后维护人'">
                <el-table-column :label="list.name" align="center" min-width="120">
                <template slot-scope="props">
                  {{props.row[list.value]}}
                </template>
              </el-table-column>
              </template>
              <template v-else-if="list.name ==='规则参数'">
                <el-table-column :label="list.name" align="center" min-width="380">
                  <template slot-scope="props">
                    {{props.row[list.value]}}
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="list.name ==='最后维护时间'">
                <el-table-column :label="list.name" align="center" min-width="180">
                  <template slot-scope="props">
                    {{props.row[list.value]}}
                  </template>
                </el-table-column>
              </template>
              <template v-else>
                <el-table-column
                  :prop="list.value"
                  align="center"
                  :label="list.name">
                </el-table-column>
              </template>

            </div>
          </el-table>
        </div>
        <el-pagination
          slot="foot"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20]"
          layout="total, sizes, prev, pager, next"
          :total="totalSize">
        </el-pagination>
      </Card>
      <!--确认删除-->
      <el-dialog
        v-loading="deleteLoading"
        title=""
        :visible.sync="isShowDelete"
        width="30%"
        :close-on-click-modal="false"
        center>
        <h3 style="text-align: center">温馨提示</h3>
        <p style="text-align: center" v-if="deleteType === 'cell'">您确认要删除该条名称为: <span class="red">{{deleteCell.ruleName}}</span> 的结算系数吗？</p>
        <p style="text-align: center" v-else>您确认要删除所选的结算系数吗？</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowDelete = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="submitDelete" size="mini">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { Component, Watch, Vue } from 'vue-property-decorator'
import Card from '@/components/Card'
import { namespace } from 'vuex-class'
import { format } from '@/utils/filter'
import { SaveAsFile } from '@/utils/lib'

const coefficientModule = namespace('settlement-coefficient/index')

@Component({
  components: { Card },
  filters: { format, SaveAsFile }
})
export default class CoefficientMaintenance extends Vue {
  loading = false
  totalSize = 0
  currentPage = 1
  tableHeight = 0
  searchKeyword=''
  deleteLoading=false// 删除行弹窗loading
  isShowDelete=false // 删除行弹窗
  deleteType = 'cell'// 删除类型 cell-删除行 multi-多行删除
  deleteCell=''
  deleteArr=[]
  productTypelist = [] // 所有的品类产品类型
  params = {
    pageNum: 1,
    pageSize: 20,
    ruleName: ''
  }
  tableHead = [
    { name: '操作', value: '' },
    { name: '选择', value: '' },
    { name: '结算系数规则名称', value: 'ruleName' },
    { name: '传单结算系数', value: 'coefficient' },
    { name: '规则参数', value: 'ruleParameters' },
    { name: '最后维护人', value: 'updateName' },
    { name: '最后维护时间', value: 'updateDate' }
  ]
  tableData= []

  // 删除结算系数
  @coefficientModule.Action batchDeleteRuleByIds
  // 查询结算系数
  @coefficientModule.Action searchByRuleName
  // 根据字典编码获取下级字典列表
  @coefficientModule.Action getDictionaryCacheListByCode

  jointRuleParameters (res) {
    this.tableData = []
    if (res.data.list.length) {
      res.data.list.forEach((item, index) => {
        let ruleParameters = []
        ruleParameters.push(this.brandFilter(item.brand))
        ruleParameters.push(this.categoryFilter(item.category))
        item.isLegacy ? ruleParameters.push('遗留单') : item.isLegacy === 0 ? ruleParameters.push('非遗留单') : item.isLegacy = true
        item.isIntegral ? ruleParameters.push('整装') : item.isIntegral === 0 ? ruleParameters.push('非整装') : item.isLegacy = true
        item.isAdditional ? ruleParameters.push('补单') : item.isAdditional === 0 ? ruleParameters.push('非补单') : item.isLegacy = true
        item.orderType ? ruleParameters.push(this.orderTypeFilter(item.orderType)) : item.isLegacy = true
        item.productType ? ruleParameters.push(this.productTypeFilter(item.productType)) : item.isLegacy = true
        item.promotionType ? ruleParameters.push(this.promotionTypeFilter(item.promotionType)) : item.isLegacy = true
        item.ruleParameters = ruleParameters.join(',')
        item.check = false
        this.tableData.push({ ...item })
        this.loading = false
      })
    } else if (res.data.list.length === 0 && this.params.pageNum !== 1) {
      this.params.pageNum -= this.params.pageNum
      this.initData()
      this.loading = false
    }

    this.totalSize = res.data.total
  }

  initData () {
    this.loading = true
    this.params.ruleName = this.searchKeyword.replace(/\s+/g, '')
    this.searchByRuleName(this.params).then(res => {
      if (res.status && res.code === '200') {
        this.getDictionaryCacheListByCode({ code: 'product_category' }).then((resCode) => {
          this.productTypelist = resCode.data
          this.jointRuleParameters(res)
        })
        console.log('获取规则系数列表成功', res)
      }
    }).catch(error => {
      this.loading = false
      console.log('获取规则系数列表error', error)
      this.$message.error('获取规则系数列表error')
    })
  }

  // 新增结算系数
  addCoefficient () {
    this.$router.push({
      name: 'coefficient-add'
    })
  }

  // 路由跳转到查看
  toCheck (row) {
    this.$router.push({
      name: 'coefficient-verify',
      query: {
        type: 'verify',
        ruleId: row.ruleId
      }
    })
  }

  // 路由跳转到编辑
  toCompile (row) {
    this.$router.push({
      name: 'coefficient-compile',
      query: {
        type: 'compile',
        ruleId: row.ruleId
      }
    })
  }
  // 删除行弹窗
  deleteShow (row) {
    this.deleteType = 'cell'
    this.isShowDelete = true
    this.deleteCell = row
  }
  // 一键删除选中
  deleteSome () {
    this.deleteArr = this.tableData.filter((item) => {
      return item.check === true
    })
    if (this.deleteArr.length) {
      this.deleteType = 'multi'
      this.isShowDelete = true
    } else {
      this.$message.warning('您没有勾选！')
    }
  }
  // 确认删除行
  submitDelete () {
    if (this.deleteType === 'cell') {
      this.tableData.forEach((item, index) => {
        if (this.deleteCell.ruleId === item.ruleId) {
          this.batchDeleteRuleByIds({ ruleIds: item.ruleId }).then(res => {
            if (res.status && res.code === '200') {
              this.initData()
              this.$message.success('删除规则成功')
              this.loading = false
            }
          }).catch(error => {
            this.loading = false
            console.log('删除单行规则error', error)
            this.$message.error('删除单行规则error')
          })
        }
      })
    } else {
      let ruleIds = []
      this.tableData.forEach((item) => {
        if (item.check) {
          ruleIds.push(item.ruleId)
        }
      })
      if (ruleIds.length) {
        ruleIds = ruleIds.join(',')
        this.batchDeleteRuleByIds({ ruleIds: ruleIds }).then(res => {
          if (res.status && res.code === '200') {
            this.loading = false
            this.$message.success('批量删除规则成功')
            this.initData()
          }
        }).catch(error => {
          this.loading = false
          console.log('批量删除规则error', error)
          this.$message.error('批量删除规则error')
        })
      } else {
        this.$message.warning('您没有选择要删除的结算系数')
      }
    }

    this.isShowDelete = false
  }

  // 处理翻页
  handleCurrentChange (val) {
    this.params.pageNum = val
    this.initData()
  }
  productTypeFilter (value) {
    let val = ''
    this.productTypelist.map((item) => {
      if (item.code === value) val = item.name
    })
    return val
  }

  promotionTypeFilter (value) {
    switch (value) {
      case 'PT' : return '普通'
      case 'ZXA' : return '直销A'
      case 'W' : return '网销'
      case 'ZX' : return '直销'
      case 'CX' : return '促销'
    }
  }
  orderTypeFilter (value) {
    switch (value) {
      case 'PTD' : return '普通单'
      case 'YPD' : return '样品单'
      case 'XYD' : return '小样单'
    }
  }
  // 品牌
  brandFilter (value) {
    switch (value) {
      case 'brand_oppein' : return '欧派'
      case 'brand_oboli' : return '欧铂丽'
      // case 'brand_oboni' : return '欧铂尼'
    }
  }

  // 品类
  categoryFilter (value) {
    switch (value) {
      case 'category_chugui' : return '橱柜'
      case 'category_weiyu' : return '卫浴'
      case 'category_yigui' : return '集成家居'
      case 'category_jinshumenchuang' : return '金属门窗'
      case 'category_mumen' : return '木门'
      // case 'category_yigui' : return '衣柜'
      case 'category_qiangshi' : return '软装'
      // case 'category_qiangshi' : return '墙饰'
      case 'category_bigFamily' : return '大家居'
    }
  }

  mounted () {
  }

  created () {
    this.tableHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 250
    if (!this.$route.meta.hidden) {
      this.initData()
    }
  }
  @Watch('$route')
  onRouterChange (route) {
    if (route.meta && !route.meta.hidden) {
      this.initData()
    }
  }
}
</script>

<style src="./style.scss" lang="scss" scoped></style>
